import { SectionHeader } from "@/components/home/SectionHeader";
import { stats } from "@/lib/content";

export function StatsGrid() {
  return (
    <section id="overview-stats" className="bg-paper px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeader
          eyebrow="02 / Overview"
          title="Compress before the query, not after"
          description="Egocentric video on AR glasses is highly redundant: consecutive frames overlap as the head moves, and most of each frame lies outside the user's attention. UTOPI removes both kinds of redundancy with signals the device already records, so the vision-language model stores and reasons over a small fraction of the original tokens."
        />
        <div className="mt-10 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="bg-paper p-6">
              <p className="font-display text-5xl font-semibold leading-none text-ink">{item.value}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
