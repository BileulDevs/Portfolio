/**
 * One cloud of voxels that reshapes itself from passion to passion as the page scrolls:
 * a grass block → a straw hat → a coupé → a ringed planet. Every shape is generated here on a
 * voxel grid (no model files) and drawn with a single InstancedMesh, so the whole section
 * costs one draw call. Loaded lazily by PassionsSection.vue.
 */
import {
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

/** Site palette (main.css) plus the hat's straw and band. */
const C = {
  lav: "#EEEDFF",
  mist: "#B6CDE8",
  coral: "#FF584D",
  slate: "#556C96",
  ink: "#1f2630",
  blue: "#7F98C2",
  straw: "#E5BE5C",
  strawLight: "#F0CF78",
  band: "#C8352E",
  tail: "#FFD2CF",
};

interface Voxel {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface Shape {
  voxels: Voxel[];
  /** Resting tilt of the whole shape toward the camera (radians around X). */
  tilt: number;
}

// ---- Shapes (grid units: one voxel = 1) ----------------------------------------------------

/** Every voxel of a box whose coordinates sit on its boundary (a hollow box). */
function shellBox(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => string) {
  const out: Voxel[] = [];
  for (let x = x0; x <= x1; x++)
    for (let y = y0; y <= y1; y++)
      for (let z = z0; z <= z1; z++)
        if (x === x0 || x === x1 || y === y0 || y === y1 || z === z0 || z === z1) out.push({ x, y, z, color: color(x, y, z) });
  return out;
}

/** A grass block: green top, dirt sides with grass dripping over the top edge, pixel-noise tones. */
function grassBlock(): Shape {
  const grass = ["#5D9C3A", "#4E8A2E", "#6DB344", "#55943A"];
  const dirt = ["#8B5A2B", "#79502A", "#9B6A3A", "#6B4423"];
  const pick = (tones: string[], x: number, y: number, z: number) => tones[Math.floor(hash(x * 7.3 + y * 13.1 + z * 3.7) * tones.length)];
  const voxels = shellBox(-3.5, 3.5, -3.5, 3.5, -3.5, 3.5, (x, y, z) => {
    if (y === 3.5) return pick(grass, x, y, z);
    // Second row from the top: grass drips down here and there.
    if (y === 2.5 && hash(x * 5.1 + z * 9.7) > 0.55) return pick(grass, x, y, z);
    return pick(dirt, x, y, z);
  });
  return { voxels, tilt: 0.45 };
}

function strawHat(): Shape {
  const voxels: Voxel[] = [];
  for (let x = -9; x <= 9; x++)
    for (let z = -9; z <= 9; z++) {
      const r2 = x * x + z * z;
      // Brim, its rim drooping a notch.
      if (r2 <= 90) voxels.push({ x, y: r2 > 64 ? -1 : 0, z, color: C.straw });
      // Crown: a hollow dome over the brim, with the red band at its base.
      for (let y = 1; y <= 6; y++) {
        const d = Math.sqrt(r2 + (y - 0.5) ** 2 * 1.15);
        if (d > 4.6 && d <= 5.6) voxels.push({ x, y, z, color: y <= 2 ? C.band : C.strawLight });
      }
    }
  return { voxels, tilt: 0.55 };
}

function coupe(): Shape {
  const body = shellBox(-8, 8, 1, 3, -3, 3, () => C.coral);
  const cabin = shellBox(-3, 4, 4, 6, -3, 3, (_x, y) => (y === 6 ? C.coral : C.ink));
  const voxels = [...body, ...cabin];
  // Lights: lavender headlights at the front (−x), pale coral tail lights.
  for (const v of voxels) {
    if (v.x === -8 && v.y === 2 && Math.abs(v.z) === 2) v.color = C.lav;
    if (v.x === 8 && v.y === 2 && Math.abs(v.z) === 2) v.color = C.tail;
  }
  // Rear wing, standing on two struts fixed to the boot.
  for (let z = -3; z <= 3; z++) voxels.push({ x: 8, y: 5, z, color: C.ink });
  for (const z of [-2, 2]) voxels.push({ x: 8, y: 4, z, color: C.ink });
  // Wheels: discs standing outside the body.
  for (const wx of [-5, 5])
    for (const wz of [-4, 4])
      for (let dx = -2; dx <= 2; dx++)
        for (let dy = -2; dy <= 2; dy++) if (dx * dx + dy * dy <= 3) voxels.push({ x: wx + dx, y: 1 + dy, z: wz, color: dx || dy ? C.ink : C.mist });
  return { voxels, tilt: 0.3 };
}

function ringedPlanet(): Shape {
  const voxels: Voxel[] = [];
  const bands = [C.blue, C.mist, C.slate, C.blue];
  for (let x = -6; x <= 6; x++)
    for (let y = -6; y <= 6; y++)
      for (let z = -6; z <= 6; z++) {
        const d = Math.sqrt(x * x + y * y + z * z);
        if (d > 4.6 && d <= 5.6) voxels.push({ x, y, z, color: bands[(y + 6) % 4] });
      }
  // Ring: an annulus, tilted.
  const tx = 0.38;
  const tz = 0.25;
  for (let x = -9; x <= 9; x++)
    for (let z = -9; z <= 9; z++) {
      const r = Math.sqrt(x * x + z * z);
      if (r < 7 || r > 9.2) continue;
      // Rotate around X then Z.
      const y1 = -z * Math.sin(tx);
      const z1 = z * Math.cos(tx);
      voxels.push({ x: x * Math.cos(tz) - y1 * Math.sin(tz), y: x * Math.sin(tz) + y1 * Math.cos(tz), z: z1, color: C.coral });
    }
  // A small moon.
  for (const [dx, dy, dz] of [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1]])
    voxels.push({ x: 10 + dx, y: 5 + dy, z: -3 + dz, color: C.lav });
  return { voxels, tilt: 0.2 };
}

// ---- Morph state ---------------------------------------------------------------------------

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
/** Deterministic noise, so the same voxel always takes the same path. */
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

interface Baked {
  pos: Float32Array;
  col: Float32Array;
  scale: Float32Array;
  tilt: number;
}

/**
 * Lays a shape out over `n` instances. Voxels are sorted bottom → top, then around the vertical
 * axis, so instance i sits in a similar region in every shape: a morph reads as one form
 * reshaping, not as noise. Spare instances hide (scale 0) inside the shape.
 */
function bake(shape: Shape, n: number): Baked {
  const vs = [...shape.voxels].sort((a, b) => a.y - b.y || Math.atan2(a.z, a.x) - Math.atan2(b.z, b.x));
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const scale = new Float32Array(n);
  const c = new Color();
  const m = vs.length;
  for (let i = 0; i < n; i++) {
    // Spread the m voxels over the n instances: instance i shows voxel j; when several instances
    // land on the same voxel, only the first is visible, the others hide inside it.
    const j = Math.floor((i * m) / n);
    const real = i === 0 || Math.floor(((i - 1) * m) / n) !== j;
    const v = vs[j];
    pos.set([v.x, v.y, v.z], i * 3);
    c.set(v.color);
    col.set([c.r, c.g, c.b], i * 3);
    scale[i] = real ? 1 : 0;
  }
  return { pos, col, scale, tilt: shape.tilt };
}

export function createVoxelMorph(canvas: HTMLCanvasElement, maxDpr = 1.75) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.2, 15);
  camera.lookAt(0, 0, 0);
  scene.add(new HemisphereLight(C.lav, C.ink, 1.7));
  const sun = new DirectionalLight("#ffffff", 2.3);
  sun.position.set(4, 6, 5);
  scene.add(sun);

  const shapes = [grassBlock(), strawHat(), coupe(), ringedPlanet()];
  const n = Math.max(...shapes.map((s) => s.voxels.length));
  const baked = shapes.map((s) => bake(s, n));

  const geo = new BoxGeometry(0.9, 0.9, 0.9);
  const mat = new MeshStandardMaterial({ flatShading: true, roughness: 0.6, metalness: 0.05 });
  const mesh = new InstancedMesh(geo, mat, n);
  const group = new Group();
  group.scale.setScalar(0.31);
  group.add(mesh);
  scene.add(group);

  // Per-voxel randomness: start delay, scatter direction, spin while flying.
  const delay = new Float32Array(n);
  const scatter = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    delay[i] = hash(i);
    scatter.set([hash(i + 0.1) * 2 - 1, hash(i + 0.2) * 2 - 1, hash(i + 0.3) * 2 - 1], i * 3);
  }

  const dummy = new Object3D();
  const color = new Color();

  /** Writes every instance for morph position `t` (0 → shapes.length − 1). */
  function layout(t: number) {
    const i0 = Math.min(shapes.length - 2, Math.floor(t));
    const frac = t - i0;
    const a = baked[i0];
    const b = baked[i0 + 1];
    for (let i = 0; i < n; i++) {
      // Each voxel leaves a little later than the previous ones (by its delay): the shape dissolves as a wave.
      const e = smooth(clamp01((frac - 0.12 - delay[i] * 0.3) / 0.46));
      const arc = Math.sin(e * Math.PI);
      const k = i * 3;
      dummy.position.set(
        a.pos[k] + (b.pos[k] - a.pos[k]) * e + scatter[k] * arc * 4,
        a.pos[k + 1] + (b.pos[k + 1] - a.pos[k + 1]) * e + scatter[k + 1] * arc * 4,
        a.pos[k + 2] + (b.pos[k + 2] - a.pos[k + 2]) * e + scatter[k + 2] * arc * 4,
      );
      dummy.rotation.set(scatter[k] * arc * 3, scatter[k + 1] * arc * 3, 0);
      dummy.scale.setScalar((a.scale[i] + (b.scale[i] - a.scale[i]) * e) * (1 - 0.35 * arc));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.setRGB(a.col[k] + (b.col[k] - a.col[k]) * e, a.col[k + 1] + (b.col[k + 1] - a.col[k + 1]) * e, a.col[k + 2] + (b.col[k + 2] - a.col[k + 2]) * e);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    const g = smooth(clamp01((frac - 0.2) / 0.6));
    return a.tilt + (b.tilt - a.tilt) * g;
  }

  return {
    setSize(w: number, h: number) {
      renderer.setPixelRatio(Math.min(devicePixelRatio, maxDpr));
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      // Narrow (portrait) stages: pull back so the widest shape (the planet's ring) still fits.
      camera.zoom = Math.min(1, camera.aspect / 1.3);
      camera.updateProjectionMatrix();
    },
    /** `t`: morph position, `px`/`py`: pointer −1 → 1. */
    render(t: number, time: number, px: number, py: number) {
      const tilt = layout(t);
      group.rotation.set(tilt + py * 0.2, time * 0.25 + px * 0.6, 0);
      group.position.y = Math.sin(time * 1.1) * 0.08;
      renderer.render(scene, camera);
    },
    dispose() {
      geo.dispose();
      mat.dispose();
      mesh.dispose();
      renderer.dispose();
    },
  };
}
