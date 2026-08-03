/**
 * Layered SVG jungle silhouettes. Each layer carries data-depth (0..1) —
 * the choreographer reads it and moves deeper layers slower during the
 * pinned Dive, which is what sells the 3D parallax illusion.
 * Server component: pure markup, zero JS.
 */

function MonsteraLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden>
      <path
        d="M100 10C55 10 18 52 18 105c0 58 40 105 82 105s82-47 82-105C182 52 145 10 100 10Zm0 24c8 18 6 40-2 56 14-10 30-12 46-6-12 12-16 30-12 46-14-8-32-6-44 4-12-10-30-12-44-4 4-16 0-34-12-46 16-6 32-4 46 6-8-16-10-38 2-56 6-2 12-2 20 0Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function PalmFrond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 160" className={className} aria-hidden>
      <path
        d="M8 150C60 60 160 8 292 12c-24 18-52 28-80 34 22 4 42 12 58 26-30 6-62 4-92-4 16 12 28 28 34 46-28-8-56-24-78-46 6 22 6 46-2 68-18-24-28-54-28-84-14 30-40 62-96 98Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Foliage() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* far canopy — barely moves */}
      <div data-depth="0.12" className="absolute -top-24 -left-24 text-emerald-950/60">
        <PalmFrond className="w-[46rem] rotate-[24deg]" />
      </div>
      <div data-depth="0.15" className="absolute -bottom-32 -right-16 text-emerald-950/50">
        <MonsteraLeaf className="w-[38rem] -rotate-[30deg]" />
      </div>

      {/* mid layer */}
      <div data-depth="0.4" className="absolute top-[16%] -right-20 text-emerald-900/70">
        <MonsteraLeaf className="w-[26rem] rotate-[18deg]" />
      </div>
      <div data-depth="0.45" className="absolute bottom-[8%] -left-14 text-emerald-900/70">
        <PalmFrond className="w-[30rem] -rotate-[12deg] -scale-x-100" />
      </div>

      {/* near layer — flies past the camera */}
      <div data-depth="0.85" className="absolute top-[58%] left-[6%] text-emerald-800/80">
        <MonsteraLeaf className="w-56 rotate-[52deg]" />
      </div>
      <div data-depth="1" className="absolute -bottom-10 right-[14%] text-emerald-800/90">
        <PalmFrond className="w-72 rotate-[8deg]" />
      </div>
    </div>
  );
}
