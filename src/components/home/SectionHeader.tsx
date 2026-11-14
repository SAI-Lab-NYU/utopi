type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  dark?: boolean;
};

export function SectionHeader({ eyebrow, title, description, dark = false }: SectionHeaderProps) {
  const ink = dark ? "text-paper" : "text-ink";
  const mutedText = dark ? "text-paper/60" : "text-muted";
  const border = dark ? "border-paper/20" : "border-ink/15";
  return (
    <div className={`grid gap-4 border-t ${border} pt-5 lg:grid-cols-[minmax(0,0.99fr)_minmax(0,0.88fr)]`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedText}`}>{eyebrow}</p>
      <div className="lg:col-start-1">
        <h2 className={`-ml-1 font-display text-3xl font-semibold leading-tight sm:text-5xl ${ink}`}>{title}</h2>
        <p className={`mt-4 text-base leading-7 ${mutedText}`}>{description}</p>
      </div>
    </div>
  );
}
