"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { canState, worldWidth } from "./canState";
import { FLAVORS, CANOPY, PAPER } from "@/lib/flavors";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The entire scroll script lives here, in document order:
 *
 *   ACT 1  #hero         hero copy lifts out, can holds center
 *   ACT 2  #dive         pinned 180vh — can spins on Y/X, foliage parallax,
 *                        bg morphs mango -> deep canopy
 *   ACT 3  #flavors      pinned 300vh — three can swaps (L exit / R entry),
 *                        bg morphs per flavor, copy crossfades
 *   ACT 4  #ingredients  can scales + translates into the #can-dock bento
 *                        cell, bg morphs to editorial paper
 *
 * Every tween is scrubbed — scroll position IS the playhead.
 */
export default function ScrollChoreographer() {
  useGSAP(
    () => {
      const bg = "#bg";
      // world-unit x just past the viewport edge, recomputed on resize
      const offstage = () =>
        worldWidth(window.innerWidth / window.innerHeight) / 2 + 1.6;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOK: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduced } = ctx.conditions as { reduced: boolean };

          if (reduced) {
            // Static fallback: park the can, let sections scroll plainly.
            gsap.set(canState, { floatAmp: 0 });
            return;
          }

          /* ---------------- ACT 1 — THE HOOK ---------------- */

          gsap.to("[data-hero-copy]", {
            yPercent: -70,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom 35%",
              scrub: true,
            },
          });

          /* ---------------- ACT 2 — THE DIVE ---------------- */

          const dive = gsap.timeline({
            scrollTrigger: {
              trigger: "#dive",
              start: "top top",
              end: "+=180%",
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          dive
            .to(canState, { floatAmp: 0, duration: 0.15 }, 0)
            // the showcase spin: 2.25 turns on Y with a tilt that resolves
            .to(canState, { rotY: Math.PI * 4.5, ease: "none", duration: 1 }, 0)
            .to(canState, { rotX: 0.42, duration: 0.4, ease: "power1.inOut" }, 0)
            .to(canState, { rotX: 0, duration: 0.5, ease: "power1.inOut" }, 0.5)
            .to(bg, { "--bg-a": CANOPY.bgA, "--bg-b": CANOPY.bgB, ease: "none", duration: 1 }, 0);

          // layered foliage parallax — depth comes from data-depth (0..1)
          gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
            const depth = parseFloat(el.dataset.depth ?? "0.3");
            dive.to(el, { y: () => -depth * 520, ease: "none", duration: 1 }, 0);
          });

          dive.fromTo(
            "[data-dive-copy]",
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
            0.55
          );

          /* ---------------- ACT 3 — THE FLAVOR CAROUSEL ---------------- */

          const swaps = FLAVORS.length - 1; // mango is already on stage
          const carousel = gsap.timeline({
            scrollTrigger: {
              trigger: "#flavors",
              start: "top top",
              end: `+=${swaps * 100}%`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          // settle the dive tilt & face the label forward before swapping
          carousel.to(canState, { rotY: Math.PI * 4, rotX: 0, duration: 0.25 }, 0);

          FLAVORS.slice(1).forEach((flavor, i) => {
            const at = 0.3 + i; // one timeline-second per swap
            carousel
              // outgoing can: hard exit stage-left with a trailing spin
              .to(
                canState.cans[i],
                { x: () => -offstage(), rotY: -1.1, duration: 0.55, ease: "power2.in" },
                at
              )
              // incoming can: enters stage-right, lands center, label forward
              .fromTo(
                canState.cans[i + 1],
                { x: () => offstage(), rotY: 1.35 },
                { x: 0, rotY: 0, duration: 0.65, ease: "power3.out" },
                at + 0.25
              )
              // the whole DOM atmosphere morphs with the can
              .to(
                bg,
                { "--bg-a": flavor.bgA, "--bg-b": flavor.bgB, duration: 0.7, ease: "none" },
                at + 0.15
              )
              // copy crossfade
              .to(`[data-flavor-copy="${i}"]`, { opacity: 0, y: -40, duration: 0.3 }, at)
              .fromTo(
                `[data-flavor-copy="${i + 1}"]`,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.35 },
                at + 0.35
              );
          });

          /* ---------------- ACT 4 — THE LANDING ---------------- */

          gsap
            .timeline({
              scrollTrigger: {
                trigger: "#ingredients",
                start: "top 85%",
                end: "top 12%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            // dock: CanRig lerps the rig onto #can-dock's projected rect
            .to(canState, { dock: 1, rotY: Math.PI * 4, rotX: 0, ease: "none" }, 0)
            .to(bg, { "--bg-a": PAPER.bgA, "--bg-b": PAPER.bgB, ease: "none" }, 0)
            // bento cells cascade in as the 3D world hands off to the grid
            .fromTo(
              "[data-bento]",
              { opacity: 0, y: 48 },
              { opacity: 1, y: 0, stagger: 0.06, ease: "power2.out" },
              0.35
            );
        }
      );

      return () => mm.revert();
    },
    []
  );

  return null;
}
