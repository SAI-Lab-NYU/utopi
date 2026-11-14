import Image from "next/image";
import { SectionHeader } from "@/components/home/SectionHeader";
import { DemoCarousel } from "@/components/home/DemoCarousel";
import { demoClips, paperAssets } from "@/lib/content";

export function DemoSection() {
  return (
    <section id="demo" className="bg-paper px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeader
          eyebrow="04 / Demo"
          title="What the model actually sees"
          description="The clips show UTOPI running on EgoEye questions at a 15% token budget: tokens kept for the language model stay at full brightness, tokens dropped by the gaze-guided selector are dimmed, and foreground tokens removed by the overlap check are marked in red. Below, the re-projection figures show where that overlap comes from: the previous frame is warped into the current viewpoint using the recorded head motion and depth."
        />

        {demoClips.length > 0 ? <DemoCarousel clips={demoClips} /> : null}

        <figure className="mt-10 border border-ink/15 bg-ink p-3 sm:p-5">
          <Image src={paperAssets.warpGrid} alt="Frames of two egocentric videos (odd rows) and the previous frame warped into each viewpoint (even rows)." width={2000} height={603} className="h-auto w-full" />
          <figcaption className="mt-3 text-sm leading-6 text-paper/70">
            Two Aria Everyday Activities sequences. Odd rows: sampled frames. Even rows: the previous frame warped into the current viewpoint with the IMU pose and depth. Black areas are newly revealed content that UTOPI keeps at full fidelity.
          </figcaption>
        </figure>

        <figure className="mt-6 grid gap-4 border border-ink/15 bg-ink p-3 sm:p-5 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <Image src={paperAssets.overlapMatch} alt="SLAM map points matched between two consecutive frames." width={2000} height={1000} className="h-auto w-full" />
          <figcaption className="text-sm leading-6 text-paper/70">
            SLAM map points of frame i&minus;1 and frame i. Blue points are observed in both frames and define the overlapping region; red points are visible in only one frame. The overlap is what the compressor removes from frame i.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
