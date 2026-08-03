/**
 * The single mutable bridge between GSAP (which tweens plain numbers on
 * the main thread) and React Three Fiber (which reads them every frame
 * inside useFrame). GSAP never touches three.js objects directly and R3F
 * never re-renders because of scroll — this is what keeps the scrub at 60fps.
 */
export type CanTransform = {
  /** world-unit x offset of this individual can inside the rig */
  x: number;
  /** extra spin applied to this individual can */
  rotY: number;
};

export const canState = {
  /** rig group transform (world units, z = 0 plane) */
  x: 0,
  y: 0,
  scale: 1,
  rotX: 0,
  rotY: 0,
  /** 0 = free-floating hero float, 1 = float suppressed (pinned/docked) */
  floatAmp: 1,
  /** 0 = fullscreen 3D stage, 1 = can is glued to the #can-dock bento cell */
  dock: 0,
  /** per-flavor can offsets — index matches FLAVORS */
  cans: [
    { x: 0, rotY: 0 },
    { x: 99, rotY: 0 },
    { x: 99, rotY: 0 },
    { x: 99, rotY: 0 },
  ] as CanTransform[],
};

/** Camera constants shared by the canvas and the choreographer so both
 *  sides agree on how big "one world unit" is on screen. */
export const CAMERA = { fov: 35, z: 8 };

/** Visible world-plane height at z=0 for our fixed camera. */
export function worldHeight() {
  return 2 * Math.tan((CAMERA.fov * Math.PI) / 360) * CAMERA.z;
}

/** Visible world-plane width for a given viewport aspect ratio. */
export function worldWidth(aspect: number) {
  return worldHeight() * aspect;
}
