"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { FLAVORS, type Flavor } from "@/lib/flavors";
import { canState, worldHeight, worldWidth } from "./canState";

/**
 * 16 oz tallboy (473 ml) — the format the ingredient panel quotes.
 * Real dimensions: 6.19" tall, 2.60" body diameter, 2.13" lid diameter.
 * Every segment below is derived from inches so the silhouette stays
 * honest; INCH converts to world units (the can stands 2.9 units tall).
 */
const INCH = 2.9 / 6.19;
export const CAN_HEIGHT = 6.19 * INCH;
const R_BODY = (2.6 / 2) * INCH;
const R_SHOULDER = (2.4 / 2) * INCH;
const R_LID = (2.13 / 2) * INCH;
const R_BASE = (2.22 / 2) * INCH;

// vertical segment boundaries, bottom -> top
const Y_BOT = -CAN_HEIGHT / 2;
const Y_BASE = Y_BOT + 0.34 * INCH; // standing rim curves out to the body
const Y_BODY = Y_BASE + 4.9 * INCH; // straight printed body
const Y_SHOULDER = Y_BODY + 0.4 * INCH; // printed shoulder curve
const Y_NECK = Y_SHOULDER + 0.25 * INCH; // bare aluminium neck
const Y_TOP = CAN_HEIGHT / 2;

/**
 * The label wraps the body AND the shoulder, so the print is split across
 * two meshes. Rather than clone the texture per mesh (which would cost a
 * second full GPU upload per can), each geometry's V coordinates are
 * remapped into its slice of the one shared texture.
 */
const BODY_UV = 4.9 / 5.3; // body's share of the 5.3" printed height

function labeledGeometry(
  rTop: number,
  rBottom: number,
  height: number,
  v0: number,
  v1: number
) {
  const g = new THREE.CylinderGeometry(rTop, rBottom, height, 72, 1, true);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setY(i, v0 + uv.getY(i) * (v1 - v0));
  uv.needsUpdate = true;
  return g;
}

// shared across all four cans — one set of GPU buffers
const BODY_GEO = labeledGeometry(R_BODY, R_BODY, Y_BODY - Y_BASE, 0, BODY_UV);
const SHOULDER_GEO = labeledGeometry(
  R_SHOULDER,
  R_BODY,
  Y_SHOULDER - Y_BODY,
  BODY_UV,
  1
);

const ALUMINIUM = { color: "#C3C7C4", metalness: 0.92, roughness: 0.28 };

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
    const limit = worldWidth(state.size.width / state.size.height) / 2 + 1.1;
    group.current.visible = Math.abs(t.x) < limit;
  });

  return (
    <group ref={group}>
      {/* printed body */}
      <mesh geometry={BODY_GEO} position={[0, (Y_BASE + Y_BODY) / 2, 0]}>
        {/* low envMapIntensity keeps the jungle HDR from bleaching the print */}
        <meshStandardMaterial
          map={label}
          metalness={0.2}
          roughness={0.42}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* printed shoulder — the label continues over the curve */}
      <mesh geometry={SHOULDER_GEO} position={[0, (Y_BODY + Y_SHOULDER) / 2, 0]}>
        <meshStandardMaterial
          map={label}
          metalness={0.2}
          roughness={0.42}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* base: body curves in to the standing rim */}
      <mesh position={[0, (Y_BOT + Y_BASE) / 2, 0]}>
        <cylinderGeometry args={[R_BODY, R_BASE, Y_BASE - Y_BOT, 72]} />
        <meshStandardMaterial {...ALUMINIUM} />
      </mesh>

      {/* bare neck above the print */}
      <mesh position={[0, (Y_SHOULDER + Y_NECK) / 2, 0]}>
        <cylinderGeometry args={[R_LID, R_SHOULDER, Y_NECK - Y_SHOULDER, 72, 1, true]} />
        <meshStandardMaterial {...ALUMINIUM} side={THREE.DoubleSide} />
      </mesh>

      {/* lid */}
      <mesh position={[0, (Y_NECK + Y_TOP) / 2, 0]}>
        <cylinderGeometry args={[R_LID, R_LID, Y_TOP - Y_NECK, 72]} />
        <meshStandardMaterial {...ALUMINIUM} />
      </mesh>

      {/* stay-on pull tab: rivet + lever plate + finger ring, angled so it
          reads in silhouette while the can spins */}
      <group
        position={[0, Y_TOP + 0.03, 0]}
        rotation={[0, Math.PI / 5, 0]}
        scale={0.82}
      >
        <mesh position={[0, 0.014, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 0.028, 24]} />
          <meshStandardMaterial color="#AFB4B1" metalness={0.95} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.024, 0.115]}>
          <boxGeometry args={[0.13, 0.016, 0.2]} />
          <meshStandardMaterial {...ALUMINIUM} />
        </mesh>
        <mesh position={[0, 0.024, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.085, 0.021, 14, 40]} />
          <meshStandardMaterial {...ALUMINIUM} />
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
