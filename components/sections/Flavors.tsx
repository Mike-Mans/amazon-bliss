import { FLAVORS } from "@/lib/flavors";

/**
 * The pinned carousel stage. The cans themselves live in the fixed canvas —
 * this section only supplies the pin height and the crossfading copy stack.
 * Copy blocks are absolutely stacked; the choreographer fades them in sync
 * with each can swap. Block 0 (Mango) starts visible.
 */
export default function Flavors() {
  return (
    <section id="flavors" className="relative min-h-[100dvh] overflow-hidden">
      <div className="relative flex min-h-[100dvh] items-end pb-[12vh] md:items-center md:pb-0">
        <div className="relative h-64 w-full px-6 md:ml-[8vw] md:max-w-lg md:px-0">
          {FLAVORS.map((flavor, i) => (
            <div
              key={flavor.key}
              data-flavor-copy={i}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/70">
                {String(i + 1).padStart(2, "0")} / {String(FLAVORS.length).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-display text-6xl tracking-tighter text-white md:text-8xl">
                {flavor.name}
              </h2>
              <p className="mt-2 text-lg font-medium text-white/85">{flavor.tagline}</p>
              <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-white/70">
                {flavor.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
