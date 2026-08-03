import Foliage from "./Foliage";

export default function Dive() {
  return (
    <section id="dive" className="relative min-h-[100dvh] overflow-hidden">
      <Foliage />

      {/* copy revealed mid-spin; asymmetric, pinned left on desktop */}
      <div
        data-dive-copy
        className="absolute bottom-[14%] left-0 w-full px-6 opacity-0 md:left-[7vw] md:max-w-md md:px-0"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-amber-200/80">
          The dive
        </p>
        <h2 className="mt-3 font-display text-4xl tracking-tighter text-amber-50 md:text-6xl">
          Every can is a
          <br />
          square meter of jungle.
        </h2>
        <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-emerald-100/75">
          Toucans, macaws, one extremely confident jaguar. Turn the can and the
          canopy turns with it — the artwork wraps the full 360.
        </p>
      </div>
    </section>
  );
}
