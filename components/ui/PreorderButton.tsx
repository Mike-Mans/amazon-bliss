import Link from "next/link";

/**
 * Fixed top-left CTA. Sits above the can canvas (z-20) but below the grain
 * overlay; solid dark pill so it reads on both the jungle and paper phases
 * of the background.
 */
export default function PreorderButton() {
  return (
    <Link
      href="/preorder"
      className="group fixed left-5 top-5 z-40 flex items-center gap-2.5 rounded-full border border-amber-200/25 bg-emerald-950/90 py-2.5 pl-5 pr-4 text-sm font-semibold tracking-tight text-amber-100 shadow-[0_8px_24px_-8px_rgba(6,28,18,0.5)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] md:left-8 md:top-7"
    >
      Preorder now
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </Link>
  );
}
