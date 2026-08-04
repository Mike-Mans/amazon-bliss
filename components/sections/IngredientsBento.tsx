/**
 * The Landing: the wild 3D stage resolves into a structured editorial grid.
 * #can-dock is deliberately empty — the fixed canvas projects the 3D can
 * onto this cell's rect, so the can literally becomes a grid element.
 */
const SOURCING = [
  { label: "Mate leaf", origin: "Misiones, Argentina", pct: "62%" },
  { label: "Fruit press", origin: "Petrolina, Brazil", pct: "31%" },
  { label: "Hibiscus", origin: "Oaxaca, Mexico", pct: "7%" },
];

export default function IngredientsBento() {
  return (
    <section id="ingredients" className="relative min-h-[100dvh] py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div data-bento className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-4xl tracking-tighter text-emerald-950 md:text-6xl">
            What is actually
            <br />
            in the can.
          </h2>
          <p className="max-w-[38ch] text-base leading-relaxed text-emerald-950/60">
            Two ingredients do the work. Everything else is water, bubbles, and
            restraint.
          </p>
        </div>

        {/* asymmetric bento: 2fr / 1fr / 1fr, dock cell spans two rows */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-[minmax(220px,auto)_minmax(220px,auto)]">
          {/* Yerba Mate — lead cell */}
          <div
            data-bento
            className="rounded-[2.5rem] border border-emerald-950/10 bg-emerald-950 p-8 text-amber-50 md:p-10"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-amber-200/70">
              The engine
            </p>
            <h3 className="mt-3 font-display text-3xl tracking-tighter md:text-5xl">Yerba Mate</h3>
            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-amber-50/70">
              Shade-grown, cold-brewed for 14 hours. Caffeine plus theobromine —
              the lift of coffee without the cliff after it.
            </p>
            <div className="mt-8 flex gap-10 border-t border-amber-50/15 pt-6">
              <div>
                <p className="font-mono text-3xl text-amber-200">83 mg</p>
                <p className="mt-1 text-sm text-amber-50/60">natural caffeine</p>
              </div>
              <div>
                <p className="font-mono text-3xl text-amber-200">14 h</p>
                <p className="mt-1 text-sm text-amber-50/60">cold steep</p>
              </div>
            </div>
          </div>

          {/* THE DOCK — the 3D can lands here. Keep it empty. */}
          <div
            id="can-dock"
            data-bento
            className="relative min-h-[380px] rounded-[2.5rem] border border-emerald-950/10 bg-gradient-to-b from-lime-100 to-lime-200/70 md:row-span-2"
          >
            <p className="absolute bottom-6 left-0 w-full text-center font-mono text-[11px] uppercase tracking-[0.4em] text-emerald-950/50">
              Kiwi — 16 oz / 473 ml
            </p>
          </div>

          {/* Real Fruit */}
          <div
            data-bento
            className="rounded-[2.5rem] border border-emerald-950/10 bg-white p-8 shadow-[0_20px_40px_-15px_rgba(20,50,30,0.08)]"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-emerald-950/40">
              The flavor
            </p>
            <h3 className="mt-3 font-display text-3xl tracking-tighter text-emerald-950">
              Real fruit
            </h3>
            <p className="mt-4 text-base leading-relaxed text-emerald-950/60">
              Pressed, never concentrated. 31% juice in every can — which is why
              no two batches taste identical.
            </p>
          </div>

          {/* Sourcing table — data grouped by rules, not boxes */}
          <div data-bento className="rounded-[2.5rem] border border-emerald-950/10 bg-white p-8 md:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-emerald-950/40">
              Sourcing
            </p>
            <div className="mt-4 divide-y divide-emerald-950/10">
              {SOURCING.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="font-medium text-emerald-950">{row.label}</span>
                  <span className="hidden flex-1 border-b border-dotted border-emerald-950/20 md:block" />
                  <span className="text-sm text-emerald-950/55">{row.origin}</span>
                  <span className="w-14 text-right font-mono text-sm text-emerald-950">{row.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer data-bento className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-emerald-950/10 pt-8 md:flex-row md:items-center">
          <p className="font-display text-2xl tracking-tighter text-emerald-950">Amazon Bliss</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-emerald-950/45">
            Brewed loud since 2024
          </p>
        </footer>
      </div>
    </section>
  );
}
