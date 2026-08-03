export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[100dvh] items-center justify-center">
      <div data-hero-copy className="relative z-10 px-4 text-center">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.4em] text-amber-200/80">
          Natural energy — brewed from the leaf
        </p>
        {/* The can (z-20 canvas) floats over the middle of this wordmark */}
        <h1 className="font-display text-[clamp(4rem,17vw,15rem)] leading-[0.82] tracking-tighter text-amber-100">
          AMAZON
          <br />
          BLISS
        </h1>
        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-emerald-100/80">
          Cold-brewed yerba mate, pressed fruit, and nothing your grandmother
          could not pronounce. Four flavors from the loudest place on earth.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.35em] text-emerald-100/50">
        Scroll to enter the canopy
      </div>
    </section>
  );
}
