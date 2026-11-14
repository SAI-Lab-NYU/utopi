import { SectionHeader } from "@/components/home/SectionHeader";
import { mainResults, robustness, systemResults } from "@/lib/content";

function Table({ head, rows }: { head: string[]; rows: { cells: string[]; ours: boolean }[] }) {
  return (
    <div className="w-full max-w-full overflow-x-auto border border-paper/20">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-paper/20 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/60">
            {head.map((cell, i) => (
              <th key={cell} className={`px-4 py-3 ${i === 0 ? "" : "text-right"}`}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className={`border-b border-paper/10 last:border-b-0 ${row.ours ? "bg-paper/10 font-semibold text-paper" : "text-paper/80"}`}>
              {row.cells.map((cell, i) => (
                <td key={i} className={`px-4 py-3 ${i === 0 ? "" : "text-right tabular-nums"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ResultsSection() {
  const accRows = mainResults.rows.map((row) => ({ cells: [row.method, row.budget, ...row.values.map((v) => `${v}%`)], ours: row.ours }));
  const sysRows = systemResults.rows.map((row) => ({ cells: [row.method, ...row.values], ours: row.ours }));

  return (
    <section id="results" className="bg-ink px-4 py-16 text-paper sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeader
          dark
          eyebrow="05 / Results"
          title="Same accuracy, a fraction of the tokens"
          description="Accuracy on three egocentric multiple-choice benchmarks with Qwen2.5-VL-7B (300 frames at 532 x 532). The token budget is enforced exactly per video for every method. System numbers are measured on a desktop GPU and on the NVIDIA Jetson Orin NX used as an AR simulation platform."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">Table 1. Accuracy, Qwen2.5-VL-7B</p>
            <Table head={["Method", "Budget", ...mainResults.columns]} rows={accRows} />
          </div>
          <div className="min-w-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">Robustness to head motion</p>
            <div className="grid gap-px border border-paper/20 bg-paper/20 sm:grid-cols-3">
              {robustness.map((item) => (
                <div key={item.label} className="bg-ink p-5">
                  <p className="font-display text-4xl font-semibold leading-none">{item.value}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em]">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-paper/60">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-paper/60">
              UTOPI also transfers to other backbones: with PLLaVA it keeps baseline accuracy on EgoSchema down to a 15% budget, and with 4-bit Qwen2.5-VL-7B it turns an out-of-memory run on Jetson Orin NX into a 3.2 GB one.
            </p>
          </div>
        </div>

        <div className="mt-10 min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">Table 2. Latency and peak dynamic memory (without model weights)</p>
          <Table head={["Method", ...systemResults.columns]} rows={sysRows} />
          <p className="mt-3 text-xs leading-5 text-paper/50">TTFT: time to first token. TPS: generated tokens per second. Peak memory excludes model weights. Jetson runs sample 100 frames per video.</p>
        </div>
      </div>
    </section>
  );
}
