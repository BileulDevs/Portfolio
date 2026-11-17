import type { Group, MeshBasicMaterial } from "@/components/carousel/threeParts";

/**
 * Minimal loader for Minecraft Bedrock models (the format Cobblemon ships: `.geo.json` geometry,
 * `.animation.json` animations, a PNG texture). Enough for small props such as a Poké Ball: bones
 * with pivots, box-UV cubes (with `inflate` and `mirror`), keyframed or Molang-driven rotations,
 * positions and scales, several animations layered at once (as Cobblemon plays idle + blink).
 * Not supported: per-face UVs, mesh geometry, Bézier keyframes (played linearly).
 */
type Vec3 = [number, number, number];
interface GeoCube { origin: Vec3; size: Vec3; uv: [number, number]; inflate?: number; mirror?: boolean; pivot?: Vec3; rotation?: Vec3 }
interface GeoBone { name: string; parent?: string; pivot?: Vec3; rotation?: Vec3; cubes?: GeoCube[] }
interface Geo { "minecraft:geometry": { description: { texture_width: number; texture_height: number }; bones: GeoBone[] }[] }
type Channel = (number | string)[] | Record<string, (number | string)[] | { pre?: (number | string)[]; post?: (number | string)[] }>;
interface AnimBone { rotation?: Channel; position?: Channel; scale?: Channel | number }
interface Anim { animation_length?: number; loop?: boolean; bones?: Record<string, AnimBone> }
interface AnimFile { animations: Record<string, Anim> }

// ---- Molang (the subset these files use) --------------------------------------------------------
/**
 * Compiles a Molang expression into a function of the animation time (seconds). Supports numbers,
 * + − * /, parentheses, unary minus, math.sin / math.cos (degrees, as in Molang), math.abs,
 * math.clamp / math.min / math.max and q(uery).anim_time. Anything else evaluates to 0 rather than throwing.
 */
export function compileMolang(source: string): (t: number) => number {
  const tokens = source.toLowerCase().match(/\d*\.?\d+|[a-z_][a-z_0-9.]*|[-+*/(),]/g) ?? [];
  let i = 0;
  type Node = (t: number) => number;
  const peek = () => tokens[i];
  const next = () => tokens[i++];
  function primary(): Node {
    const tok = next();
    if (tok === undefined) return () => 0;
    if (tok === "(") {
      const inner = sum();
      next(); // ")"
      return inner;
    }
    if (tok === "-") {
      const inner = primary();
      return (t) => -inner(t);
    }
    if (/^\d*\.?\d+$/.test(tok)) {
      const n = Number(tok);
      return () => n;
    }
    if (tok === "q.anim_time" || tok === "query.anim_time") return (t) => t;
    if (tok.startsWith("math.") && peek() === "(") {
      next();
      const args: Node[] = [sum()];
      while (peek() === ",") {
        next();
        args.push(sum());
      }
      next(); // ")"
      const [a, b, c] = args;
      switch (tok) {
        case "math.sin": return (t) => Math.sin((a(t) * Math.PI) / 180);
        case "math.cos": return (t) => Math.cos((a(t) * Math.PI) / 180);
        case "math.abs": return (t) => Math.abs(a(t));
        case "math.min": return (t) => Math.min(a(t), b?.(t) ?? 0);
        case "math.max": return (t) => Math.max(a(t), b?.(t) ?? 0);
        case "math.clamp": return (t) => Math.min(c?.(t) ?? 0, Math.max(b?.(t) ?? 0, a(t)));
        default: return () => 0;
      }
    }
    return () => 0;
  }
  function product(): Node {
    let left = primary();
    while (peek() === "*" || peek() === "/") {
      const op = next(), right = primary(), l = left;
      left = op === "*" ? (t) => l(t) * right(t) : (t) => l(t) / (right(t) || 1);
    }
    return left;
  }
  function sum(): Node {
    let left = product();
    while (peek() === "+" || peek() === "-") {
      const op = next(), right = product(), l = left;
      left = op === "+" ? (t) => l(t) + right(t) : (t) => l(t) - right(t);
    }
    return left;
  }
  return sum();
}

type Vec3Fn = (t: number) => Vec3;
function vec3(values: (number | string)[]): Vec3Fn {
  const parts = values.map((v) => (typeof v === "number" ? () => v : compileMolang(v)));
  return (t) => [parts[0]?.(t) ?? 0, parts[1]?.(t) ?? 0, parts[2]?.(t) ?? 0];
}
/** A channel as a function of time: a constant/Molang triple, or keyframes interpolated linearly. */
function channel(c: Channel): Vec3Fn {
  if (Array.isArray(c)) return vec3(c);
  const keys = Object.entries(c)
    .map(([time, v]) => ({ time: Number(time), at: vec3(Array.isArray(v) ? v : (v.post ?? v.pre ?? [0, 0, 0])) }))
    .sort((a, b) => a.time - b.time);
  return (t) => {
    if (t <= keys[0].time) return keys[0].at(t);
    for (let k = 1; k < keys.length; k++) {
      if (t > keys[k].time) continue;
      const a = keys[k - 1], b = keys[k], u = (t - a.time) / (b.time - a.time);
      const va = a.at(t), vb = b.at(t);
      return [va[0] + (vb[0] - va[0]) * u, va[1] + (vb[1] - va[1]) * u, va[2] + (vb[2] - va[2]) * u];
    }
    return keys[keys.length - 1].at(t);
  };
}

// ---- Geometry -------------------------------------------------------------------------------------
/** Box-UV rectangles [u0, v0, u1, v1] of a cube's faces, in the BoxGeometry order +x −x +y −y +z −z. */
function boxUv([u, v]: [number, number], [w, h, d]: Vec3, mirror = false): [number, number, number, number][] {
  const faces: [number, number, number, number][] = [
    [u, v + d, u + d, v + d + h], // east
    [u + d + w, v + d, u + 2 * d + w, v + d + h], // west
    [u + d, v, u + d + w, v + d], // top
    [u + d + w, v + d, u + d + 2 * w, v], // bottom (stored upside down)
    [u + 2 * d + w, v + d, u + 2 * d + 2 * w, v + d + h], // south
    [u + d, v + d, u + d + w, v + d + h], // north
  ];
  if (!mirror) return faces;
  // Mirrored cube: every face flipped horizontally, and east / west swapped.
  const flip = ([u0, v0, u1, v1]: [number, number, number, number]): [number, number, number, number] => [u1, v0, u0, v1];
  return [flip(faces[1]), flip(faces[0]), flip(faces[2]), flip(faces[3]), flip(faces[4]), flip(faces[5])];
}

const DEG = Math.PI / 180;
/**
 * Bedrock's x axis points the other way from three.js's (as Blockbench converts it): every x position
 * is negated, rotations become (−x, −y, z). The box-UV layout above is already written for that space.
 */
const MIRROR_X = -1;

export async function loadBedrockModel(urls: { geo: string; animations: string; texture: string }) {
  const T = await import("@/components/carousel/threeParts");
  const [geo, anims, image] = await Promise.all([
    fetch(urls.geo).then((r) => r.json() as Promise<Geo>),
    fetch(urls.animations).then((r) => r.json() as Promise<AnimFile>),
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`texture not found: ${urls.texture}`));
      img.src = urls.texture;
    }),
  ]);
  const model = geo["minecraft:geometry"][0];
  const { texture_width: texW, texture_height: texH } = model.description;
  const texture = new T.Texture(image);
  texture.magFilter = T.NearestFilter;
  texture.minFilter = T.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = T.SRGBColorSpace;
  texture.needsUpdate = true;

  /** Every cube's geometry, built once and shared by all copies of the model. */
  const geometries = new Map<GeoCube, InstanceType<typeof T.BoxGeometry>>();
  for (const bone of model.bones) for (const cube of bone.cubes ?? []) {
    const grow = (cube.inflate ?? 0) * 2;
    const g = new T.BoxGeometry(cube.size[0] + grow, cube.size[1] + grow, cube.size[2] + grow);
    const uv = g.attributes.uv;
    boxUv(cube.uv, cube.size, cube.mirror).forEach(([u0, v0, u1, v1], face) => {
      // BoxGeometry face vertices: top-left, top-right, bottom-left, bottom-right.
      const corners = [[u0, v0], [u1, v0], [u0, v1], [u1, v1]];
      corners.forEach(([u, v], k) => uv.setXY(face * 4 + k, u / texW, 1 - v / texH));
    });
    geometries.set(cube, g);
  }
  const compiled = new Map(
    Object.entries(anims.animations).map(([name, a]) => [
      name,
      {
        length: a.animation_length ?? 0,
        loop: a.loop === true,
        bones: Object.entries(a.bones ?? {}).map(([bone, ch]) => ({
          bone,
          rotation: ch.rotation ? channel(ch.rotation) : null,
          position: ch.position ? channel(ch.position) : null,
          scale: ch.scale === undefined ? null : channel(typeof ch.scale === "number" ? [ch.scale, ch.scale, ch.scale] : ch.scale),
        })),
      },
    ]),
  );

  return {
    /** Lengths of the named animations, in seconds (0 for endless ones). */
    length: (name: string) => compiled.get(name)?.length ?? 0,
    /** Height of the model at rest, in pixels (lowest to highest cube). */
    height: (() => {
      const cubes = model.bones.flatMap((b) => b.cubes ?? []);
      if (!cubes.length) return 0;
      return Math.max(...cubes.map((c) => c.origin[1] + c.size[1])) - Math.min(...cubes.map((c) => c.origin[1]));
    })(),
    /**
     * A new copy of the model (in pixels, 16 per block), with its own material for fading.
     * `hide`: bones left out, such as alternative faces that Cobblemon only shows for an expression.
     */
    build(options: { hide?: RegExp } = {}) {
      const material: MeshBasicMaterial = new T.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.1 });
      const root: Group = new T.Group();
      const bones = new Map<string, { group: Group; rest: Vec3; home: Vec3 }>();
      for (const bone of model.bones) {
        const pivot = bone.pivot ?? [0, 0, 0];
        const parent = bone.parent ? bones.get(bone.parent) : undefined;
        const parentPivot = parent ? (model.bones.find((b) => b.name === bone.parent)?.pivot ?? [0, 0, 0]) : [0, 0, 0];
        const group = new T.Group();
        group.rotation.order = "ZYX";
        group.position.set(MIRROR_X * (pivot[0] - parentPivot[0]), pivot[1] - parentPivot[1], pivot[2] - parentPivot[2]);
        const rest: Vec3 = bone.rotation ?? [0, 0, 0];
        group.rotation.set(-rest[0] * DEG, -rest[1] * DEG, rest[2] * DEG);
        for (const cube of bone.cubes ?? []) {
          const mesh = new T.Mesh(geometries.get(cube)!, material);
          // A rotated cube turns around its own pivot (inside the bone), like the bones themselves.
          const at = cube.rotation ? (cube.pivot ?? pivot) : pivot;
          mesh.position.set(
            MIRROR_X * (cube.origin[0] + cube.size[0] / 2 - at[0]),
            cube.origin[1] + cube.size[1] / 2 - at[1],
            cube.origin[2] + cube.size[2] / 2 - at[2],
          );
          if (!cube.rotation) {
            group.add(mesh);
            continue;
          }
          const hinge = new T.Group();
          hinge.rotation.order = "ZYX";
          hinge.position.set(MIRROR_X * (at[0] - pivot[0]), at[1] - pivot[1], at[2] - pivot[2]);
          hinge.rotation.set(-cube.rotation[0] * DEG, -cube.rotation[1] * DEG, cube.rotation[2] * DEG);
          hinge.add(mesh);
          group.add(hinge);
        }
        if (options.hide?.test(bone.name)) group.visible = false;
        (parent?.group ?? root).add(group);
        bones.set(bone.name, { group, rest, home: [group.position.x, group.position.y, group.position.z] });
      }
      return {
        root,
        material,
        /**
         * Poses the model from one or more animations, each at its own time in seconds (looping ones
         * wrap). Layers add up, as in Cobblemon: rotations and positions sum, scales multiply.
         */
        pose(...layers: [name: string, time: number][]) {
          const sums = new Map<Group, { r: Vec3; p: Vec3; s: Vec3 }>();
          for (const [name, time] of layers) {
            const anim = compiled.get(name);
            if (!anim) continue;
            const t = anim.loop && anim.length ? time % anim.length : time;
            for (const { bone, rotation, position, scale } of anim.bones) {
              const b = bones.get(bone);
              if (!b) continue;
              let sum = sums.get(b.group);
              if (!sum) sums.set(b.group, (sum = { r: [0, 0, 0], p: [0, 0, 0], s: [1, 1, 1] }));
              if (rotation) rotation(t).forEach((v, k) => (sum!.r[k] += v));
              if (position) position(t).forEach((v, k) => (sum!.p[k] += v));
              if (scale) scale(t).forEach((v, k) => (sum!.s[k] *= v));
            }
          }
          for (const { group, rest, home } of bones.values()) {
            const sum = sums.get(group);
            const r = sum?.r ?? [0, 0, 0], p = sum?.p ?? [0, 0, 0], k = sum?.s ?? [1, 1, 1];
            group.rotation.set(-(rest[0] + r[0]) * DEG, -(rest[1] + r[1]) * DEG, (rest[2] + r[2]) * DEG);
            group.position.set(home[0] + MIRROR_X * p[0], home[1] + p[1], home[2] + p[2]);
            group.scale.set(k[0] || 1e-4, k[1] || 1e-4, k[2] || 1e-4);
          }
        },
      };
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      texture.dispose();
    },
  };
}
export type BedrockModel = Awaited<ReturnType<typeof loadBedrockModel>>;
