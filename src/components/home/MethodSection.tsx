import Image from "next/image";
import { SectionHeader } from "@/components/home/SectionHeader";
import { methodModules, paperAssets } from "@/lib/content";

export function MethodSection() {
  return (
    <section id="method" className="bg-paper px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeader
          eyebrow="03 / Method"
          title="Two user signals, two kinds of redundancy"
          description="After the vision encoder, every frame is a grid of visual tokens. The Adaptive Gaze-Aware Token Selector keeps the tokens the user attended to; the Inter-Frame View Overlap Compressor then removes tokens that re-appear from the previous frame under the measured head motion. Only the surviving tokens, with their original spatio-temporal positions, are passed to the language decoder."
        />

        <figure className="mt-10 border border-ink/15 bg-white p-3 sm:p-5">
          <Image src={paperAssets.workflow} alt="Overall workflow of UTOPI: video encoding, Adaptive Gaze-Aware Token Selector and Inter-Frame View Overlap Compressor." width={2116} height={786} className="h-auto w-full" />
          <figcaption className="mt-3 text-sm leading-6 text-muted">
            Fig. 2. Visual tokens from the vision encoder (A) are scored by gaze and a saliency predictor (B), then re-projected into the previous frame with the IMU pose estimate to remove overlap and summarise it with cluster centres (C).
          </figcaption>
        </figure>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {methodModules.map((module) => {
            const Icon = module.icon;
            return (
              <article key={module.tag} className="flex flex-col border border-ink/15 bg-paper p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center border border-ink bg-ink font-display text-sm font-semibold text-paper">{module.tag}</span>
                  <Icon aria-hidden="true" size={20} strokeWidth={1.6} className="text-warm" />
                  <h3 className="font-display text-xl font-semibold leading-tight text-ink sm:text-2xl">{module.title}</h3>
                </div>
                <p className="mt-5 text-base leading-7 text-ink/85">{module.body}</p>
                <ul className="mt-5 space-y-2 border-t border-ink/15 pt-5 text-sm leading-6 text-muted">
                  {module.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-[11px] h-px w-4 shrink-0 bg-warm" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <figure className="mt-8 grid gap-4 border border-ink/15 bg-white p-3 sm:p-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <Image src={paperAssets.imuProjection} alt="IMU-based inter-frame coordinate projection." width={2000} height={770} className="h-auto w-full" />
          <figcaption className="text-sm leading-6 text-muted">
            A token at (w, h) in frame i is lifted to a 3D point with its depth, moved by the relative camera pose between the two frames, and projected to (w&prime;, h&prime;) in frame i&minus;1. The pose comes from the headset&rsquo;s IMU and SLAM trajectory, so no feature matching is needed at run time.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
