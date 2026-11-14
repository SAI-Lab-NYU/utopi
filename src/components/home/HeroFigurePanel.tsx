import Image from "next/image";
import { ArrowUpRight, Film } from "lucide-react";
import { paperAssets, pdfHref } from "@/lib/content";

export function HeroFigurePanel() {
  return (
    <div className="relative overflow-hidden border border-ink/15 bg-[#efede6] p-3 shadow-hairline sm:p-4">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(17,17,17,0.055)_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="relative z-10 border border-ink/15 bg-paper">
        <div className="flex items-center justify-between border-b border-ink/15 px-4 py-3">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            <Film aria-hidden="true" size={14} strokeWidth={1.7} />
            Fig. 1
          </div>
          <a href={pdfHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition hover:text-warm">
            Full paper
            <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.7} />
          </a>
        </div>
        <div className="bg-white p-2 sm:p-3">
          <Image src={paperAssets.teaser} alt="UTOPI pre-compresses egocentric video: temporal redundancy from head motion and spatial redundancy outside the user's attention are removed before the query stage." width={2000} height={548} className="h-auto w-full" priority />
        </div>
        <div className="border-t border-ink/15 px-4 py-3 text-sm leading-6 text-muted">
          An AR headset streams egocentric video. UTOPI drops tokens that were already seen (temporal) and tokens the user never looked at (spatial) before the video reaches the language model, so a later query such as &ldquo;how many plates are in my drawer?&rdquo; is answered from a fraction of the tokens.
        </div>
      </div>
    </div>
  );
}
