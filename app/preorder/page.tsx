import type { Metadata } from "next";
import Link from "next/link";
import PreorderForm from "@/components/preorder/PreorderForm";

export const metadata: Metadata = {
  title: "Preorder — Amazon Bliss",
  description: "Reserve cans from the first Amazon Bliss production run.",
};

export default function PreorderPage() {
  return (
    <main className="min-h-[100dvh] bg-[#F6F3EA] text-emerald-950">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-10 md:grid-cols-[1.1fr_1fr] md:gap-20 md:px-8 md:py-16">
        {/* left column: nav + pitch */}
        <div>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-950/60 transition-colors hover:text-emerald-950"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M13 8H3M7 4L3 8l4 4" />
            </svg>
            Back to the jungle
          </Link>

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.4em] text-emerald-700">
            First production run — ships October 2026
          </p>
          <h1 className="mt-4 font-display text-5xl tracking-tighter md:text-7xl">
            Get the first
            <br />
            cans out of
            <br />
            the canopy.
          </h1>
          <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-emerald-950/60">
            The first run is 12,000 cans across four flavors. Preorders are
            charged at ship time and come with the sampler pricing locked in —
            cancel any time before the pallet leaves Petrolina.
          </p>

        </div>

        {/* right column: the form */}
        <div className="md:pt-24">
          <PreorderForm />
        </div>
      </div>
    </main>
  );
}
