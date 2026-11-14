import { BookOpen, Eye, FileText, Github, Move3D, type LucideIcon } from "lucide-react";

const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export const paperHref = "https://arxiv.org/abs/2611.11562";
export const pdfHref = "https://arxiv.org/pdf/2611.11562";
export const codeHref = "https://github.com/SAI-Lab-NYU/utopi-code";

export const venue = "NeurIPS 2026";

export const title = {
  short: "UTOPI",
  full: "Efficient Egocentric Long-Video Understanding in AR via User-Guided Token Pre-Compression",
  tagline:
    "A plug-and-play pre-compression module that uses head motion and eye gaze from AR devices to prune visual tokens before the language decoder."
};

export const authors: { name: string; affiliations: number[]; marks?: string }[] = [
  { name: "Ziqi Wang", affiliations: [1] },
  { name: "Su Chen", affiliations: [1] },
  { name: "Qiance Tang", affiliations: [1] },
  { name: "Jieyu Lin", affiliations: [2] },
  { name: "Ziyun Li", affiliations: [2] },
  { name: "Barbara De Salvo", affiliations: [2] },
  { name: "Sai Qian Zhang", affiliations: [1] }
];

export const affiliations = ["New York University", "Meta Reality Labs"];

export const navItems = [
  { label: "UTOPI", href: "#overview" },
  { label: "Method", href: "#method" },
  { label: "Demo", href: "#demo" },
  { label: "Results", href: "#results" },
  { label: "Cite", href: "#citation" }
];

export const sectionIndex = [
  { number: "01", label: "UTOPI", href: "#overview" },
  { number: "02", label: "Overview", href: "#overview-stats" },
  { number: "03", label: "Method", href: "#method" },
  { number: "04", label: "Demo", href: "#demo" },
  { number: "05", label: "Results", href: "#results" },
  { number: "06", label: "Citation", href: "#citation" }
];

export const primaryLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Paper", href: paperHref, icon: FileText },
  { label: "Code", href: codeHref, icon: Github },
  { label: "PDF", href: pdfHref, icon: BookOpen }
];

export const footerLinks = primaryLinks;

export const paperAssets = {
  metaIcon: assetPath("/paper-assets/meta-icon.png"),
  teaser: assetPath("/paper-assets/overall.png"),
  workflow: assetPath("/paper-assets/overview-figure.png"),
  imuProjection: assetPath("/paper-assets/imu-projection.png"),
  warpGrid: assetPath("/paper-assets/warp-grid.png"),
  overlapMatch: assetPath("/paper-assets/overlap-match.png")
};

// Numbers below are taken from the paper (Tables 1 and 2).
export const stats = [
  { value: "95%", label: "Max compression", detail: "Visual tokens removed before the decoder while keeping accuracy" },
  { value: "5%", label: "Token budget", detail: "Qwen2.5-VL-7B on EgoSchema still matches the uncompressed model" },
  { value: "67%", label: "Peak memory saved", detail: "Dynamic memory (activations and KV cache) on an RTX A6000" },
  { value: "2.2x", label: "Faster first token", detail: "Time to first token on GPU, 2.0x on Jetson Orin NX" },
  { value: "<1 s", label: "Overhead", detail: "673 ms to pre-compress 300 frames, 1.6 GFLOPs in total" },
  { value: "6", label: "VLM backbones", detail: "Qwen2.5-VL, VideoLLaMA3, PLLaVA, InternVL2.5, SmolVLM, Qwen 3B" }
];

export const methodModules: { tag: string; title: string; icon: LucideIcon; body: string; bullets: string[] }[] = [
  {
    tag: "A",
    title: "Adaptive Gaze-Aware Token Selector",
    icon: Eye,
    body:
      "Eye tracking tells us where the user looked. A Gaussian prior centred on the gaze point is combined with a lightweight saliency predictor (an MLP on each visual token), and tokens whose combined score exceeds an adaptive threshold are kept as attended foreground.",
    bullets: [
      "Gaussian prior G at the gaze point times a learned per-token saliency score",
      "Threshold chosen per video so that exactly the target token budget is kept",
      "Predictor trained end-to-end through the hard selection with a straight-through estimator on 2k calibration QA pairs"
    ]
  },
  {
    tag: "B",
    title: "Inter-Frame View Overlap Compressor",
    icon: Move3D,
    body:
      "Head motion from the IMU and SLAM pipeline gives the camera pose of every frame. Each foreground token is re-projected into the previous frame through depth and pose; if the feature at the projected location is nearly identical, the token is redundant and dropped, so the first appearance of a region is kept at full fidelity.",
    bullets: [
      "Pixel-to-pixel re-projection with intrinsics, depth and relative pose, robust to viewpoint shift",
      "Cosine similarity above a threshold marks a token as already seen",
      "Redundant tokens are summarised by k-means surrogate tokens (2% of the cluster) instead of being discarded blindly"
    ]
  }
];

export type DemoClip = { title: string; caption: string; src: string; poster?: string };

// Demo clips live in public/demo (about 1 MB each). Rendered with tools/render_demo_clip.py from the
// token-selection export of `scripts/eval_egoeye.py --drop_vis_dir` in the code repo (EgoEye questions,
// AEA videos, 15% budget). Leave the list empty to hide the carousel.
const demoClip = (slug: string, title: string, caption: string): DemoClip => ({
  title,
  caption,
  src: assetPath(`/demo/${slug}.mp4`),
  poster: assetPath(`/demo/${slug}.jpg`)
});

export const demoClips: DemoClip[] = [
  demoClip(
    "clip-headboard",
    "Object attribute: bedroom",
    "Question: What is the color of my bed's headboard? UTOPI keeps 15% of the visual tokens, concentrated around the gaze path, and answers 'Dark blue' (correct)."
  ),
  demoClip(
    "clip-tiki-count",
    "Counting: fireplace mantel",
    "Question: How many wooden tiki sculptures were on the fireplace mantel? The kept tokens follow the fixations on the mantel; the model answers 'Four' (correct)."
  ),
  demoClip(
    "clip-sour-cream",
    "Episodic recall: kitchen",
    "Question: What specific brand and type of sour cream did I put in the fridge after my last grocery run? Answer: the 'Daisy' brand, 'Light' version (correct)."
  ),
  demoClip(
    "clip-paintings",
    "Scene detail: dining room",
    "Question: Which of the three paintings on the wall shows a beach with trees? Red regions are foreground tokens dropped by IVOC because the previous frame already covered them. Answer: the middle painting (correct)."
  ),
  demoClip(
    "clip-shirt-color",
    "Self-appearance: kitchen and pool",
    "Question: What color shirt was I wearing right after I stood up from the sofa? Answer: a blue short-sleeved polo shirt (correct)."
  ),
  demoClip(
    "clip-wristband",
    "Self-appearance: hallway",
    "Question: Which wrist did I have my wristband on earlier? Answer: the left wrist (correct)."
  )
];

export const mainResults = {
  columns: ["EgoEye", "EgoSchema", "EgoGazeVQA"],
  rows: [
    { method: "Qwen2.5-VL-7B (no compression)", budget: "100%", values: ["58.4", "60.1", "47.8"], ours: false },
    { method: "w/ UTOPI (ours)", budget: "15%", values: ["60.6", "64.8", "49.0"], ours: true },
    { method: "w/ DTD", budget: "15%", values: ["57.6", "64.5", "47.9"], ours: false },
    { method: "w/ PruneVid", budget: "15%", values: ["51.3", "63.0", "48.8"], ours: false },
    { method: "w/ Random Drop", budget: "15%", values: ["56.8", "59.3", "46.1"], ours: false },
    { method: "Uniform downsampling", budget: "15%", values: ["50.4", "53.8", "44.2"], ours: false },
    { method: "w/ UTOPI (ours)", budget: "30%", values: ["57.4", "62.6", "48.7"], ours: true },
    { method: "w/ UTOPI (ours)", budget: "50%", values: ["57.1", "61.9", "48.5"], ours: true }
  ]
};

export const systemResults = {
  columns: ["Platform", "Budget", "Peak mem.", "TTFT", "TPS", "EgoEye acc."],
  rows: [
    { method: "Qwen2.5-VL-7B", values: ["RTX A6000", "100%", "19.8 GB", "19.3 s", "7.5", "58.4%"], ours: false },
    { method: "w/ UTOPI", values: ["RTX A6000", "15%", "6.6 GB (-67%)", "8.7 s (2.2x)", "26.6 (3.5x)", "60.6%"], ours: true },
    { method: "Qwen2.5-VL-7B 4-bit", values: ["Jetson Orin NX", "100%", "7.1 GB (OOM)", "173 s (OOM)", "0.43", "57.3%"], ours: false },
    { method: "w/ UTOPI", values: ["Jetson Orin NX", "15%", "3.2 GB (-55%)", "88 s (2.0x)", "1.3 (3.0x)", "57.5%"], ours: true },
    { method: "Qwen2.5-VL-3B 4-bit", values: ["Jetson Orin NX", "100%", "6.4 GB", "122 s", "0.73", "52.0%"], ours: false },
    { method: "w/ UTOPI", values: ["Jetson Orin NX", "25%", "2.9 GB (-55%)", "65 s (1.9x)", "2.0 (2.7x)", "52.1%"], ours: true },
    { method: "SmolVLM 2.2B", values: ["Jetson Orin NX", "100%", "2.9 GB", "21 s", "3.2", "46.3%"], ours: false },
    { method: "w/ UTOPI", values: ["Jetson Orin NX", "60%", "2.0 GB (-32%)", "13 s (1.6x)", "4.8 (1.5x)", "45.9%"], ours: true }
  ]
};

export const robustness = [
  { label: "Fast motion", value: "63.6%", detail: "EgoSchema, motion-intensive subset, 15% budget" },
  { label: "Slow motion", value: "66.0%", detail: "EgoSchema, low-motion subset, 15% budget" },
  { label: "Average", value: "64.8%", detail: "EgoSchema, all videos, 15% budget" }
];

export const citation = `@inproceedings{wang2026utopi,
  title     = {UTOPI: Efficient Egocentric Long-Video Understanding in AR via User-Guided Token Pre-Compression},
  author    = {Ziqi Wang and Su Chen and Qiance Tang and Jieyu Lin and Ziyun Li and Barbara De Salvo and Sai Qian Zhang},
  booktitle = {Advances in Neural Information Processing Systems (NeurIPS)},
  year      = {2026},
  url       = {https://arxiv.org/abs/2611.11562}
}`;
