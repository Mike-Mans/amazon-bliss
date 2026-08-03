"use client";

import { useMemo, useState } from "react";
import { FLAVORS } from "@/lib/flavors";

const PRICE_PER_CAN = 3.4;
const FREE_SHIPPING_AT = 40;
const SHIPPING = 5.9;

type Status = "idle" | "paying" | "done";

const money = (n: number) => `$${n.toFixed(2)}`;

export default function PreorderForm() {
  const [qty, setQty] = useState<Record<string, number>>({
    mango: 4,
    pineapple: 0,
    peach: 0,
    kiwi: 0,
  });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [orderId, setOrderId] = useState("");

  const bump = (key: string, delta: number) =>
    setQty((cur) => ({
      ...cur,
      [key]: Math.min(48, Math.max(0, (cur[key] ?? 0) + delta)),
    }));

  const totals = useMemo(() => {
    const cans = Object.values(qty).reduce((a, b) => a + b, 0);
    const subtotal = cans * PRICE_PER_CAN;
    const shipping = cans === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING;
    return { cans, subtotal, shipping, total: subtotal + shipping };
  }, [qty]);

  const checkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totals.cans === 0) return;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Enter a valid email for the order confirmation.");
      return;
    }
    setEmailError(null);
    setStatus("paying");
    // Stripe Checkout goes here — create a session server-side and redirect.
    await new Promise((r) => setTimeout(r, 1100));
    setOrderId(`AB-${Math.floor(1000 + Math.random() * 9000)}`);
    setStatus("done");
  };

  if (status === "done") {
    return (
      <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-8 md:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-emerald-700">
          Order {orderId} confirmed
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tighter text-emerald-950">
          The jungle is packing.
        </h2>
        <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-emerald-950/60">
          {totals.cans} cans reserved from the first run. A confirmation is on
          its way to {email} — you will not be charged until the pallet ships.
        </p>
        <div className="mt-6 flex items-baseline justify-between border-t border-emerald-950/10 pt-4">
          <span className="text-sm text-emerald-950/55">Total at ship time</span>
          <span className="font-mono text-xl text-emerald-950">{money(totals.total)}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={checkout} noValidate>
      <p className="mb-3 text-sm font-semibold text-emerald-950">Your cans</p>

      {/* cart rows */}
      <div className="divide-y divide-emerald-950/10 rounded-[2rem] border border-emerald-950/10 bg-white px-6">
        {FLAVORS.map((f) => {
          const n = qty[f.key] ?? 0;
          return (
            <div key={f.key} className="flex items-center gap-4 py-4">
              <span
                className="h-10 w-10 shrink-0 rounded-full border border-emerald-950/10"
                style={{ background: `linear-gradient(160deg, ${f.bgA}, ${f.bgB})` }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-tight tracking-tight text-emerald-950">
                  {f.name}
                </p>
                <p className="truncate text-xs text-emerald-950/50">
                  {money(PRICE_PER_CAN)} per can
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => bump(f.key, -1)}
                  disabled={n === 0}
                  aria-label={`Remove one ${f.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-emerald-950/15 text-lg text-emerald-950 transition-colors hover:border-emerald-950/40 active:scale-[0.94] disabled:opacity-30"
                >
                  &minus;
                </button>
                <span className="w-9 text-center font-mono text-base text-emerald-950">{n}</span>
                <button
                  type="button"
                  onClick={() => bump(f.key, 1)}
                  aria-label={`Add one ${f.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-emerald-950/15 text-lg text-emerald-950 transition-colors hover:border-emerald-950/40 active:scale-[0.94]"
                >
                  +
                </button>
              </div>
              <span className="hidden w-16 text-right font-mono text-sm text-emerald-950 sm:block">
                {money(n * PRICE_PER_CAN)}
              </span>
            </div>
          );
        })}
      </div>

      {/* totals */}
      <div className="mt-5 space-y-2 px-2">
        <div className="flex items-baseline justify-between text-sm text-emerald-950/60">
          <span>Subtotal ({totals.cans} cans)</span>
          <span className="font-mono">{money(totals.subtotal)}</span>
        </div>
        <div className="flex items-baseline justify-between text-sm text-emerald-950/60">
          <span>Shipping</span>
          <span className="font-mono">
            {totals.shipping === 0 ? (totals.cans === 0 ? "—" : "Free") : money(totals.shipping)}
          </span>
        </div>
        {totals.cans > 0 && totals.shipping > 0 && (
          <p className="text-xs text-emerald-700">
            {money(FREE_SHIPPING_AT - totals.subtotal)} away from free shipping.
          </p>
        )}
        <div className="flex items-baseline justify-between border-t border-emerald-950/10 pt-3 text-emerald-950">
          <span className="font-semibold">Total</span>
          <span className="font-mono text-xl">{money(totals.total)}</span>
        </div>
      </div>

      {/* email */}
      <div className="mt-6 flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-emerald-950">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@thecanopy.com"
          className={`rounded-xl border bg-white px-4 py-3 text-base text-emerald-950 outline-none transition-colors placeholder:text-emerald-950/30 focus:border-emerald-700 ${
            emailError ? "border-rose-600" : "border-emerald-950/15"
          }`}
        />
        <p className="text-xs text-emerald-950/45">
          Order confirmation only. You are charged when the run ships.
        </p>
        {emailError && <p className="text-sm text-rose-700">{emailError}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "paying" || totals.cans === 0}
        className="mt-7 w-full rounded-full bg-emerald-950 py-4 text-base font-semibold tracking-tight text-amber-100 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "paying"
          ? "Processing…"
          : totals.cans === 0
            ? "Add some cans first"
            : `Checkout — ${money(totals.total)}`}
      </button>
    </form>
  );
}
