"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DemoClip } from "@/lib/content";

export function DemoCarousel({ clips }: { clips: DemoClip[] }) {
  const [index, setIndex] = useState(0);
  const clip = clips[index];
  const go = (delta: number) => setIndex((current) => (current + delta + clips.length) % clips.length);

  return (
    <div className="mt-10 border border-ink/15 bg-paper">
      <div className="flex items-center justify-between border-b border-ink/15 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Clip {index + 1} / {clips.length}
        </p>
        <div className="flex gap-1">
          <button type="button" onClick={() => go(-1)} aria-label="Previous clip" className="grid h-9 w-9 place-items-center border border-ink/15 text-ink transition hover:border-ink hover:bg-ink hover:text-paper">
            <ChevronLeft size={16} strokeWidth={1.8} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next clip" className="grid h-9 w-9 place-items-center border border-ink/15 text-ink transition hover:border-ink hover:bg-ink hover:text-paper">
            <ChevronRight size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
      <div className="bg-ink p-1">
        <video key={clip.src} className="aspect-video h-auto w-full" src={clip.src} poster={clip.poster} controls muted playsInline preload="metadata" />
      </div>
      <div className="px-4 py-4">
        <p className="font-display text-lg font-semibold text-ink">{clip.title}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{clip.caption}</p>
      </div>
    </div>
  );
}
