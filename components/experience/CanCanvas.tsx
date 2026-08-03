"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { CAMERA } from "./canState";
import CanRig from "./CanRig";

/**
 * One persistent, fixed, full-viewport canvas. The can never unmounts —
 * it travels between "sections" purely via the transforms GSAP writes
 * into canState. pointer-events-none so the DOM underneath stays usable.
 */
export default function CanCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20" aria-hidden>
      {/* `flat` disables ACES tone mapping — it was desaturating and
          lifting the label art; print graphics want raw sRGB output */}
      <Canvas
        flat
        camera={{ fov: CAMERA.fov, position: [0, 0, CAMERA.z] }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 5]} intensity={1.05} />
        <directionalLight position={[-5, 2, -3]} intensity={0.35} color="#BFE8C4" />
        <Suspense fallback={null}>
          <CanRig />
          {/* Swap for <Environment files="/hdr/jungle.hdr" /> in production */}
          <Environment preset="forest" />
        </Suspense>
        <ContactShadows position={[0, -1.45, 0]} opacity={0.35} scale={8} blur={2.6} far={2} />
      </Canvas>
    </div>
  );
}
