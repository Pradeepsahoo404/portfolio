export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="border-b border-white/5 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-white md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-zinc-400">{subtitle}</p>}
      </div>
    </section>
  );
}
