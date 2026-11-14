"""Render a UTOPI demo clip for the project page.

Input: a token-selection json exported by `scripts/eval_egoeye.py --drop_vis_dir`
(from the utopi-code repo), the source video, and the question/answer text.
Output: an H.264 mp4 (1280x720) and a poster jpg.

Layout: left 720x720 video frame with the selection overlay, right panel with
question, answer, legend and a live token counter.

Usage:
  python tools/render_demo_clip.py vis.json --video clip.mp4 \
      --question "..." --answer "..." --correct --out public/demo/clip1
"""
import argparse, json, subprocess, textwrap
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument("vis_json")
ap.add_argument("--video", required=True)
ap.add_argument("--question", required=True)
ap.add_argument("--answer", required=True)
ap.add_argument("--correct", action="store_true")
ap.add_argument("--budget", default="15%")
ap.add_argument("--out", required=True, help="output path without extension")
ap.add_argument("--mode", choices=["sampled", "full"], default="full",
                help="sampled: play only the 150 token frames at --fps; full: play every source frame at --speed x")
ap.add_argument("--speed", type=float, default=1.0, help="full mode: playback speed relative to real time")
ap.add_argument("--start", type=float, default=None, help="full mode: window start in seconds of the source video")
ap.add_argument("--end", type=float, default=None, help="full mode: window end in seconds of the source video")
ap.add_argument("--fps", type=int, default=24, help="sampled mode: output frame rate")
ap.add_argument("--hold", type=float, default=2.0, help="seconds to hold the last frame")
ap.add_argument("--reveal", type=float, default=0.7, help="fraction of the clip after which the answer shows")
ap.add_argument("--ffmpeg", default="ffmpeg")
a = ap.parse_args()

d = json.load(open(a.vis_json))
H, W = d["frame_h"], d["frame_w"]
hp, wp, ts = d["h_patches"], d["w_patches"], d["token_size"]
N = hp * wp
idx = d["sampled_indices"]
F = len(idx)
keep = np.zeros(F * N, bool); keep[d["keep_flat_indices"]] = True
red = np.zeros(F * N, bool); red[d["redundant_flat_indices"]] = True
keep = keep.reshape(F, hp, wp); red = red.reshape(F, hp, wp)
gaze = d["gaze_model_px"]

CW, CH = 1280, 720          # canvas
VS = 720                    # video panel size (square)
PX = VS + 40                # text panel x
PW = CW - PX - 40           # text panel width
PAPER = (246, 244, 239); INK = (17, 17, 17); MUTED = (109, 106, 99)
LINE = (216, 213, 204); COOL = (56, 88, 255); WARM = (230, 80, 47)
YELLOW = (255, 214, 10)

def font(size, bold=False):
    try:
        return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size, index=1 if bold else 0)
    except Exception:
        return ImageFont.load_default()
F_EYE = font(15, True); F_Q = font(26, True); F_A = font(22); F_S = font(17); F_NUM = font(30, True)

def wrap(text, fnt, width, draw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= width: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def frame_source():
    """Yield (token_frame_index, rgb array) for every output frame, streaming from ffmpeg."""
    pre = ["-ss", f"{a.start:.3f}"] if a.start else []
    post = ["-to", f"{a.end - (a.start or 0):.3f}"] if a.end else []
    cmd = [a.ffmpeg, "-v", "error", *pre, "-i", a.video, *post, "-vf",
           f"scale={VS}:{VS}:force_original_aspect_ratio=decrease,pad={VS}:{VS}:-1:-1:color=black",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    nbytes = VS * VS * 3
    dec = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    idx_arr = np.array(idx)
    n = int(round((a.start or 0) * src_fps)) if a.mode == "full" else 0   # absolute source frame index
    try:
        while True:
            buf = dec.stdout.read(nbytes)
            if len(buf) < nbytes: break
            if a.mode == "full":
                f = int(np.argmin(np.abs(idx_arr - n)))   # nearest sampled token frame
                yield f, np.frombuffer(buf, np.uint8).reshape(VS, VS, 3)
            elif n in want:
                yield int(np.searchsorted(idx_arr, n)), np.frombuffer(buf, np.uint8).reshape(VS, VS, 3)
            n += 1
            if a.mode == "sampled" and n > idx_arr.max(): break
    finally:
        dec.stdout.close(); dec.kill(); dec.wait()

want = set(idx)
probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                            "stream=r_frame_rate,nb_frames", "-of", "csv=p=0", a.video],
                       capture_output=True, text=True, check=True).stdout.strip().split(",")
num, den = probe[0].split("/"); src_fps = float(num) / float(den)
if a.mode == "full":
    out_fps = src_fps * a.speed
    n_src = int(probe[1]) if probe[1].isdigit() else max(idx) + 1
    w0 = a.start or 0.0; w1 = a.end if a.end else n_src / src_fps
    n_out = int(round((w1 - w0) * src_fps))
else:
    out_fps = float(a.fps); n_out = F

enc = subprocess.Popen([a.ffmpeg, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                        "-s", f"{CW}x{CH}", "-r", f"{out_fps:.4f}", "-i", "-",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p",
                        "-movflags", "+faststart", a.out + ".mp4"], stdin=subprocess.PIPE)

sx, sy = VS / W, VS / H
total_kept = int(keep.sum()); total_tokens = F * N
poster = None
hold_frames = int(a.hold * out_fps)
reveal_at = int(a.reveal * n_out)
mask_cache = {}

def compose(f, frame, fi):
    if f not in mask_cache:
        kmask = np.kron(keep[f], np.ones((ts, ts), bool))[:H, :W]
        rmask = np.kron(red[f], np.ones((ts, ts), bool))[:H, :W]
        kmask = np.array(Image.fromarray(kmask).resize((VS, VS), Image.NEAREST), bool)
        rmask = np.array(Image.fromarray(rmask).resize((VS, VS), Image.NEAREST), bool)
        mask_cache[f] = (kmask, rmask)
    kmask, rmask = mask_cache[f]
    img = frame.astype(np.float32)
    dim = ~kmask
    img[dim] = img[dim] * 0.3
    img[rmask] = img[rmask] * 0.5 + np.array(WARM, np.float32) * 0.5
    canvas = Image.new("RGB", (CW, CH), PAPER)
    canvas.paste(Image.fromarray(img.astype(np.uint8)), (0, 0))
    dr = ImageDraw.Draw(canvas)
    gx, gy = gaze[f]
    if gx >= 0:
        cx, cy = gx * sx, gy * sy
        dr.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], outline=YELLOW, width=4)
        dr.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=YELLOW)
    y = 44
    dr.text((PX, y), f"UTOPI  /  {a.budget} TOKEN BUDGET", font=F_EYE, fill=COOL); y += 34
    for ln in wrap(a.question, F_Q, PW, dr):
        dr.text((PX, y), ln, font=F_Q, fill=INK); y += 34
    y += 14; dr.line([(PX, y), (PX + PW, y)], fill=LINE, width=1); y += 22
    dr.text((PX, y), "MODEL ANSWER", font=F_EYE, fill=MUTED); y += 26
    if fi >= reveal_at:
        for ln in wrap(a.answer, F_A, PW, dr):
            dr.text((PX, y), ln, font=F_A, fill=INK); y += 30
        if a.correct:
            y += 6; dr.text((PX, y), "\u2713 correct", font=F_S, fill=COOL); y += 24
    else:
        dr.text((PX, y), "watching...", font=F_A, fill=MUTED); y += 30
    # legend and counter sit above the player's control bar
    ly = CH - 230
    for col, lab in [(None, "kept tokens (full brightness)"), ((60, 60, 60), "dropped by AGTS (dimmed)"),
                     (WARM, "redundant foreground removed by IVOC"), (YELLOW, "gaze point")]:
        if col is None: dr.rectangle([PX, ly + 3, PX + 14, ly + 17], outline=INK, width=2)
        else: dr.rectangle([PX, ly + 3, PX + 14, ly + 17], fill=col)
        dr.text((PX + 24, ly), lab, font=F_S, fill=MUTED); ly += 26
    kept_f = int(keep[f].sum())
    dr.text((PX, CH - 110), f"token frame {f + 1}/{F}   kept {kept_f}/{N}   clip total {total_kept}/{total_tokens}",
            font=F_S, fill=MUTED)
    return canvas

fi = 0; last = None
for f, frame in frame_source():
    canvas = compose(f, frame, fi)
    enc.stdin.write(canvas.tobytes())
    if fi == int(n_out * 0.35): poster = canvas.copy()
    last = (f, frame); fi += 1
for _ in range(hold_frames):
    enc.stdin.write(compose(last[0], last[1], fi).tobytes()); fi += 1
if poster is None: poster = compose(last[0], last[1], fi)
enc.stdin.close(); enc.wait()
assert enc.returncode == 0, "ffmpeg encode failed"
poster.save(a.out + ".jpg", quality=85)
print("wrote", a.out + ".mp4", a.out + ".jpg", f"kept {total_kept}/{total_tokens} = {100*total_kept/total_tokens:.1f}%")
