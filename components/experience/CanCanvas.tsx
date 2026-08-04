"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Lightformer } from "@react-three/drei";
import { Suspense } from "react";
import { CAMERA } from "./canState";
import CanRig, { CAN_HEIGHT } from "./CanRig";

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
          {/*
            Environment built procedurally from lightformers rather than a
            preset. `preset="forest"` pulls a 1k HDR from a third-party CDN
            (raw.githack.com), and because that fetch suspends this boundary,
            a slow or blocked CDN meant the can never rendered at all. This
            renders once to a small cube target: no network, no suspense.
          */}
          <Environment resolution={256}>
            {/* warm canopy light from above */}
            <Lightformer
              intensity={2.2}
              position={[0, 4, 3]}
              scale={[10, 5, 1]}
              color="#fff3d6"
            />
            {/* green bounce from the foliage on either side */}
            <Lightformer
              intensity={1.1}
              position={[-5, 1, 1]}
              scale={[5, 8, 1]}
              color="#a9e0b4"
            />
            <Lightformer
              intensity={0.9}
              position={[5, 0, -2]}
              scale={[6, 8, 1]}
              color="#2f6b45"
            />
            {/* tight highlight so the aluminium reads as metal */}
            <Lightformer
              intensity={3}
              position={[2, 3, 4]}
              scale={[1.5, 4, 1]}
              color="#ffffff"
            />
          </Environment>
        </Suspense>
        {/* sits exactly on the can's base */}
        <ContactShadows
          position={[0, -CAN_HEIGHT / 2, 0]}
          opacity={0.35}
          scale={8}
          blur={2.6}
          far={2}
        />
      </Canvas>
    </div>
  );
}
