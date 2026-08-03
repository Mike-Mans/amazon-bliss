"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { FLAVORS, type Flavor } from "@/lib/flavors";
import { canState, worldHeight, worldWidth } from "./canState";

const CAN_HEIGHT = 2.4;
const CAN_RADIUS = 0.68;

/**
 * A can wrapped in the real label art (processed from the print sheets in
 * /public/wraps). To move to a full GLTF later, swap the meshes for
 * <primitive object={gltf.scene} /> — rig transforms and choreography
 * stay identical.
 */
function FlavorCan({ flavor, index }: { flavor: Flavor; index: number }) {
  const group = useRef<THREE.Group>(null!);
  // three.js fetches this at runtime, outside Next's URL rewriting — the
  // deployment base path must be prefixed by hand
  const label = useTexture(
    `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/wraps/${flavor.key}.jpg`
  );

  const { gl } = useThree();

  useMemo(() => {
    label.colorSpace = THREE.SRGBColorSpace;
    label.anisotropy = gl.capabilities.getMaxAnisotropy();
    label.wrapS = THREE.RepeatWrapping;
    // cylinder UVs start at the front — shift so the label seam sits at
    // the back and the wordmark faces the camera
    label.offset.x = 0.5;
  }, [label, gl]);

  useFrame((state) => {
    const t = canState.cans[index];
    group.current.position.x = t.x;
    group.current.rotation.y = t.rotY;

    // Visibility culling — THE fix for the "can pops over the whole screen"
    // bug: parked cans used to sit at x=99 while still attached to a rig
    // that rotates during the pinned sections; at radius 99 they periodically
    // swept through the camera. Cans beyond the carousel's off-stage slot are
    // now hidden outright and only appear while they are actually on stage.
    const limit =
      worldWidth(state.size.width / state.size.height) / 2 + 1.1;
    group.current.visible = Math.abs(t.x) < limit;
  });

  return (
    <group ref={group}>
      <mesh>
        <cylinderGeometry args={[CAN_RADIUS, CAN_RADIUS, CAN_HEIGHT, 64, 1, true]} />
        {/* low envMapIntensity keeps the jungle HDR from bleaching the print */}
        <meshStandardMaterial
          map={label}
          metalness={0.2}
          roughness={0.42}
          envMapIntensity={0.4}
        />
      </mesh>
      {/* lids */}
      {[CAN_HEIGHT / 2, -CAN_HEIGHT / 2].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[y > 0 ? 0 : Math.PI, 0, 0]}>
          <cylinderGeometry args={[CAN_RADIUS * 0.94, CAN_RADIUS, 0.09, 64]} />
          <meshStandardMaterial color="#C8CCC9" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      {/* stay-on pull tab: rivet + lever plate + finger ring, angled so it
          reads in silhouette while the can spins */}
      <group position={[0, CAN_HEIGHT / 2 + 0.045, 0]} rotation={[0, Math.PI / 5, 0]}>
        <mesh position={[0, 0.014, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 0.028, 24]} />
          <meshStandardMaterial color="#AFB4B1" metalness={0.95} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.024, 0.115]}>
          <boxGeometry args={[0.13, 0.016, 0.2]} />
          <meshStandardMaterial color="#C8CCC9" metalness={0.92} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.024, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.085, 0.021, 14, 40]} />
          <meshStandardMaterial color="#C8CCC9" metalness={0.92} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export default function CanRig() {
  const rig = useRef<THREE.Group>(null!);
  const { camera, size } = useThree();
  const dockEl = useRef<HTMLElement | null>(null);

  useFrame((state) => {
    const s = canState;
    const t = state.clock.elapsedTime;

    // idle float, faded out whenever the choreography takes over
    const float = Math.sin(t * 1.3) * 0.07 * s.floatAmp;
    const bob = Math.sin(t * 0.9 + 1.7) * 0.02 * s.floatAmp;

    let x = s.x;
    let y = s.y + float;
    let scale = s.scale;

    // Dock blending: project the #can-dock bento cell into world space and
    // lerp the whole rig onto it. Runs only while the final transition is live.
    if (s.dock > 0) {
      if (!dockEl.current) dockEl.current = document.getElementById("can-dock");
      const rect = dockEl.current?.getBoundingClientRect();
      if (rect) {
        const wH = worldHeight();
        const wW = worldWidth(size.width / size.height);
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const tx = (cx / size.width - 0.5) * wW;
        const ty = -(cy / size.height - 0.5) * wH;
        const tScale = ((rect.height / size.height) * wH * 0.62) / CAN_HEIGHT;
        x = THREE.MathUtils.lerp(s.x, tx, s.dock);
        y = THREE.MathUtils.lerp(s.y + float, ty, s.dock);
        scale = THREE.MathUtils.lerp(s.scale, tScale, s.dock);
      }
    }

    rig.current.position.set(x, y + bob, 0);
    rig.current.rotation.set(s.rotX, s.rotY, 0);
    rig.current.scale.setScalar(scale);
  });

  return (
    <group ref={rig}>
      {FLAVORS.map((flavor, i) => (
        <FlavorCan key={flavor.key} flavor={flavor} index={i} />
      ))}
    </group>
  );
}
