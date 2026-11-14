"use client";

import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { citation, footerLinks } from "@/lib/content";

export function CitationSection() {
  const [copied, setCopied] = useState(false);
  const copyCitation = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="citation" className="border-t border-ink/15 bg-[#f6f4ef] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[0.7fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">06 / Citation</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">Cite UTOPI</h2>
          <p className="mt-4 max-w-md text-base leading-7 text-muted">If UTOPI is useful for your research, please cite the NeurIPS 2026 paper.</p>
          <div className="mt-8 grid grid-cols-3 gap-2 sm:max-w-lg">
            {footerLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-ink/15 bg-paper px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-ink hover:bg-ink hover:text-paper">
                  <span className="flex items-center gap-2">
                    <Icon aria-hidden="true" size={15} strokeWidth={1.7} />
                    {link.label}
                  </span>
                  <ExternalLink aria-hidden="true" size={14} strokeWidth={1.7} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="border border-ink bg-ink p-4 text-paper sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-paper/20 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">BibTeX</p>
            <button type="button" onClick={copyCitation} className="inline-flex items-center gap-2 border border-paper/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-paper/70 transition hover:border-paper/60 hover:text-paper">
              <Copy aria-hidden="true" size={14} strokeWidth={1.7} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-paper/80">{citation}</pre>
        </div>
      </div>
    </section>
  );
}
