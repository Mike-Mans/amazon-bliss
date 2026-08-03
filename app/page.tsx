import PreorderButton from "@/components/ui/PreorderButton";
import SmoothScroll from "@/components/experience/SmoothScroll";
import ScrollChoreographer from "@/components/experience/ScrollChoreographer";
import CanCanvas from "@/components/experience/CanCanvas";
import Hero from "@/components/sections/Hero";
import Dive from "@/components/sections/Dive";
import Flavors from "@/components/sections/Flavors";
import IngredientsBento from "@/components/sections/IngredientsBento";
import { FLAVORS } from "@/lib/flavors";

/**
 * Layer map (bottom -> top):
 *   #bg        fixed  z-0   morphing gradient atmosphere (GSAP tweens its CSS vars)
 *   <main>            z-10  DOM sections; #dive and #flavors get pinned by ScrollTrigger
 *   CanCanvas  fixed  z-20  the persistent 3D can, pointer-events-none
 *   .grain     fixed  z-60  film grain overlay
 */
export default function Page() {
  return (
    <>
      <SmoothScroll />
      <ScrollChoreographer />

      <div
        id="bg"
        className="fixed inset-0 z-0"
        style={
          {
            "--bg-a": FLAVORS[0].bgA,
            "--bg-b": FLAVORS[0].bgB,
          } as React.CSSProperties
        }
      />

      <CanCanvas />
      <PreorderButton />

      <main className="relative z-10">
        <Hero />
        <Dive />
        <Flavors />
        <IngredientsBento />
      </main>
    </>
  );
}
