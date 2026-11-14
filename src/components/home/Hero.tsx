import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { HeroFigurePanel } from "@/components/home/HeroFigurePanel";
import { affiliations, authors, paperAssets, primaryLinks, title, venue } from "@/lib/content";

export function Hero() {
  return (
    <section id="overview" className="relative overflow-hidden border-b border-ink/[0.12] pt-16" aria-labelledby="hero-title">
      <div className="absolute inset-0 -z-10 bg-paper" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(17,17,17,.055)_1px,transparent_1px),linear-gradient(180deg,rgba(17,17,17,.055)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 sm:px-6 lg:min-h-[calc(100vh-14rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(480px,0.88fr)] lg:px-8 lg:py-12">
        <div className="flex flex-col">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="border border-ink/[0.18] bg-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink">{venue}</span>
            <span className="inline-flex items-center gap-2 border border-cool/25 bg-cool/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              <span>In collaboration with</span>
              <Image src={paperAssets.metaIcon} alt="Meta" width={62} height={16} className="h-4 w-auto" />
            </span>
          </div>

          <h1 id="hero-title" className="mt-5 font-display text-[clamp(3.6rem,16vw,4.4rem)] font-black uppercase leading-[0.85] text-ink sm:text-[clamp(4.5rem,9vw,8.5rem)]">
            {title.short}
          </h1>

          <div className="mt-7 grid w-full gap-5 border-y border-ink/15 py-6 pl-2 md:grid-cols-[1.08fr_0.72fr]">
            <p className="text-xl leading-snug text-ink [text-wrap:balance] sm:text-2xl">{title.full}</p>
            <p className="text-sm leading-6 text-muted">{title.tagline}</p>
          </div>

          <div className="mt-6 w-full pl-2 text-center text-sm font-semibold uppercase leading-relaxed tracking-[0.16em]">
            <p className="text-base text-ink sm:text-lg">
              {authors.map((author, index) => (
                <span key={author.name} className="inline-block whitespace-nowrap px-1.5">
                  {author.name}
                  <sup>
                    {author.affiliations.join(",")}
                    {author.marks ?? ""}
                  </sup>
                  {index < authors.length - 1 ? "," : ""}
                </span>
              ))}
            </p>
            <p className="mt-3 text-ink/70">
              {affiliations.map((name, index) => (
                <span key={name} className="inline-block px-2">
                  <sup>{index + 1}</sup>
                  {name}
                </span>
              ))}
            </p>
          </div>

          <div className="mt-8 max-w-[44rem] self-center lg:self-start">
            <div className="grid grid-cols-1 gap-2 min-[460px]:grid-cols-3">
              {primaryLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex min-h-16 min-w-[11rem] items-center border border-ink/[0.18] bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                      <Icon aria-hidden="true" size={17} strokeWidth={1.7} className="shrink-0" />
                      {link.label}
                    </span>
                    <ArrowDownRight aria-hidden="true" size={14} strokeWidth={1.7} className="absolute bottom-0.5 right-0.5 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="self-center lg:pt-8">
          <HeroFigurePanel />
        </div>
      </div>
    </section>
  );
}
