import type { MeshBasicMaterial, Object3D } from "@/components/carousel/threeParts";

/**
 * Minecraft-style blocks drawn as 3D items (the feature carousel of the Minecraft case study).
 * Items are blocks or Cobblemon models (a Poké Ball). Two uses: `createItemFactory` for items placed in
 * another scene (the carousel), and `createItemRenderer`, one WebGL renderer that draws single items
 * onto 2D canvases.
 * Textures are 16×16 pixel art generated here (seeded, so identical on every load), except the grass
 * side, which is the case study's own texture.
 */
export type BlockKind = "grass" | "log" | "diamond" | "gold" | "emerald" | "redstone" | "lapis" | "iron" | "coal" | "spawner";
export const BLOCK_KINDS: readonly BlockKind[] = ["grass", "log", "diamond", "gold", "emerald", "redstone", "lapis", "iron", "coal", "spawner"];
/** Fleck colours of each ore (stone with a few clusters of them). */
const ORES: Partial<Record<BlockKind, { seed: number; colours: string[] }>> = {
  diamond: { seed: 31, colours: ["#5decf5", "#4ad3df", "#a9f7fb", "#2fb7c4"] },
  gold: { seed: 41, colours: ["#fcee4b", "#f5c242", "#fffd9e", "#d39c2a"] },
  emerald: { seed: 51, colours: ["#17dd62", "#41f384", "#0f9f45", "#8ff9b4"] },
  redstone: { seed: 61, colours: ["#ff0000", "#d10000", "#ff5a5a", "#9e0000"] },
  lapis: { seed: 71, colours: ["#1d4fd6", "#2f68f0", "#123a9e", "#6f96ff"] },
  iron: { seed: 81, colours: ["#d8af93", "#e2c0a6", "#b98d71", "#f0d8c4"] },
  coal: { seed: 91, colours: ["#2b2b2b", "#1a1a1a", "#3d3d3d", "#111111"] },
};

const TEX = 16;
const GRASS_SIDE = "/projects/cobblemon-mods/mc-grass-block.png";
/** The Cobblemon Spawner mod's own block texture (16×16, the same on all six faces). */
const SPAWNER_TEXTURE = "/projects/cobblemon-mods/pokemon-spawner.png";
/**
 * Its retouch, made at load: drawn SPAWNER_SCALE times finer, each pixel blending its own colour with
 * its neighbours' (SPAWNER_SMOOTH: 0 = sharp, 1 = fully blended), then a seeded brightness noise.
 */
const SPAWNER_SCALE = 4;
const SPAWNER_SMOOTH = 0.5;
const SPAWNER_NOISE = 0.07;
const SPAWNER_SEED = 101;
/** Minecraft's fixed face shading: top lit, sides dimmer, bottom darkest. Order: +x −x +y −y +z −z. */
const SHADE = [0.8, 0.8, 1, 0.5, 0.65, 0.65];

/** Small deterministic random generator (mulberry32), so a block looks the same every time. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A 16×16 canvas filled pixel by pixel: `pick(x, y, rand)` returns each pixel's colour. */
function paint(seed: number, pick: (x: number, y: number, rand: () => number) => string) {
  const c = document.createElement("canvas");
  c.width = c.height = TEX;
  const g = c.getContext("2d")!;
  const rand = rng(seed);
  for (let y = 0; y < TEX; y++) for (let x = 0; x < TEX; x++) {
    g.fillStyle = pick(x, y, rand);
    g.fillRect(x, y, 1, 1);
  }
  return c;
}
const from = (palette: string[]) => (rand: () => number) => palette[Math.floor(rand() * palette.length)];

const STONE = from(["#7d7d7d", "#757575", "#868686", "#6b6b6b", "#8f8f8f"]);
/** Ore = stone with a few clustered flecks of `colours`. */
function ore(seed: number, colours: string[]) {
  const flecks = new Set<number>();
  const rand = rng(seed * 7 + 1);
  for (let k = 0; k < 5; k++) {
    const cx = 2 + Math.floor(rand() * 12), cy = 2 + Math.floor(rand() * 12);
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [-1, 0], [1, 1]]) if (rand() < 0.8) flecks.add((cy + dy) * TEX + cx + dx);
  }
  const fleck = from(colours);
  return paint(seed, (x, y, r) => (flecks.has(y * TEX + x) ? fleck(r) : STONE(r)));
}

/**
 * The spawner's texture, smoother and grainier than the mod's: SPAWNER_SCALE times finer, each pixel
 * half its own colour and half a blend of its neighbours (bilinear), times a seeded brightness noise.
 */
function retouchSpawner(img: HTMLImageElement) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const source = document.createElement("canvas");
  source.width = w;
  source.height = h;
  const read = source.getContext("2d")!;
  read.drawImage(img, 0, 0);
  const src = read.getImageData(0, 0, w, h).data;
  const at = (x: number, y: number, c: number) => src[(Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))) * 4 + c];

  const out = document.createElement("canvas");
  out.width = w * SPAWNER_SCALE;
  out.height = h * SPAWNER_SCALE;
  const write = out.getContext("2d")!;
  const pixels = write.createImageData(out.width, out.height);
  const rand = rng(SPAWNER_SEED);
  for (let Y = 0; Y < out.height; Y++) for (let X = 0; X < out.width; X++) {
    // Position in source pixels, measured from pixel centres, for the bilinear blend.
    const u = (X + 0.5) / SPAWNER_SCALE - 0.5, v = (Y + 0.5) / SPAWNER_SCALE - 0.5;
    const x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0;
    const noise = 1 + (rand() * 2 - 1) * SPAWNER_NOISE;
    const o = (Y * out.width + X) * 4;
    for (let c = 0; c < 3; c++) {
      const own = at(Math.floor(X / SPAWNER_SCALE), Math.floor(Y / SPAWNER_SCALE), c);
      const blend =
        (at(x0, y0, c) * (1 - fx) + at(x0 + 1, y0, c) * fx) * (1 - fy) +
        (at(x0, y0 + 1, c) * (1 - fx) + at(x0 + 1, y0 + 1, c) * fx) * fy;
      pixels.data[o + c] = Math.min(255, (own * (1 - SPAWNER_SMOOTH) + blend * SPAWNER_SMOOTH) * noise);
    }
    pixels.data[o + 3] = 255;
  }
  write.putImageData(pixels, 0, 0);
  return out;
}

/** The six faces of each block, in the order +x −x +y −y +z −z. */
function faces(kind: BlockKind, grassSide: HTMLImageElement | null, spawner: HTMLImageElement | null): (HTMLCanvasElement | HTMLImageElement)[] {
  switch (kind) {
    case "spawner":
      // Without its image, a coal block stands in.
      return Array(6).fill(spawner ? retouchSpawner(spawner) : ore(ORES.coal!.seed, ORES.coal!.colours));
    case "grass": {
      const top = paint(11, (_x, _y, r) => from(["#5d9b2f", "#6aa83a", "#4f8a26", "#73b443"])(r));
      const dirt = paint(12, (_x, _y, r) => from(["#79553a", "#866043", "#6b4a32", "#8f6a4b", "#5d3f2a"])(r));
      const side = grassSide ?? dirt;
      return [side, side, top, dirt, side, side];
    }
    case "log": {
      const bark = paint(21, (x, _y, r) => {
        const stripe = x % 4 === 0 || x % 7 === 3;
        return stripe ? "#4a3a22" : from(["#6b5232", "#5f4a2c", "#735a37"])(r);
      });
      const rings = paint(22, (x, y, r) => {
        const d = Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5));
        if (d > 6.5) return from(["#6b5232", "#5f4a2c"])(r);
        return Math.round(d) % 2 ? "#b8945f" : from(["#a07e4c", "#9a774a"])(r);
      });
      return [bark, bark, rings, rings, bark, bark];
    }
    default: {
      const { seed, colours } = ORES[kind]!;
      return Array(6).fill(ore(seed, colours));
    }
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // fall back to plain dirt sides
    img.src = src;
  });
}

/** The six shaded, pixel-sharp face materials of every block, ready for `new Mesh(box, materials)`. */
async function createBlockMaterials() {
  const T = await import("@/components/carousel/threeParts");
  const [grassSide, spawner] = await Promise.all([loadImage(GRASS_SIDE), loadImage(SPAWNER_TEXTURE)]);
  const materials = new Map<BlockKind, MeshBasicMaterial[]>();
  for (const kind of BLOCK_KINDS) {
    materials.set(kind, faces(kind, grassSide, spawner).map((img, i) => {
      const tex = new T.Texture(img);
      tex.magFilter = T.NearestFilter;
      tex.minFilter = T.NearestFilter;
      tex.generateMipmaps = false;
      tex.colorSpace = T.SRGBColorSpace;
      tex.needsUpdate = true;
      const shade = SHADE[i];
      return new T.MeshBasicMaterial({ map: tex, color: new T.Color(shade, shade, shade) });
    }));
  }
  return {
    materials,
    dispose() {
      materials.forEach((list) => list.forEach((mat) => {
        mat.map?.dispose();
        mat.dispose();
      }));
    },
  };
}

// ---- Items: blocks, plus Cobblemon models ----------------------------------------------------------
/** Models taken from Cobblemon (MPL-2.0, credited on the page), in public/projects/cobblemon-mods/cobblemon/. */
export const COBBLEMON = "/projects/cobblemon-mods/cobblemon/";
/** Balls: Cobblemon draws them all with the Poké Ball's model and animations, each with its texture. */
export type BallKind = "poke_ball" | "safari_ball" | "beast_ball";
export const BALL_KINDS: readonly BallKind[] = ["poke_ball", "safari_ball", "beast_ball"];
/** Flat pixel-art items, extruded like Minecraft's held items (see `buildSprite`). */
export type SpriteKind = "marks_ribbon";
const SPRITES: Record<SpriteKind, string> = { marks_ribbon: "/projects/cobblemon-mods/marks-ribbon.png" };
const SPRITE_KINDS = Object.keys(SPRITES) as SpriteKind[];
const isSprite = (kind: ItemKind): kind is SpriteKind => kind in SPRITES;
/** A sprite's thickness, in its own pixels (Minecraft's 16-pixel items are 1 pixel thick). */
const SPRITE_DEPTH_PX = 2;
/** Alpha below which a sprite's pixel is cut out (see makeSprite: kept below the carousel's faded opacity). */
const SPRITE_ALPHA_TEST = 0.01;
/** Shading of the sprite's faces, as for blocks: front and back lit, sides dimmer, underside darkest. */
const SPRITE_SHADE = { face: 1, side: 0.8, top: 1, bottom: 0.5 };
export type ItemKind = BlockKind | BallKind | SpriteKind;
export const isBall = (kind: ItemKind): kind is BallKind => (BALL_KINDS as readonly string[]).includes(kind);
/** The Poké Ball's height in pixels (8 + its outline), so it can be scaled to a block's size. */
export const BALL_PX = 8.5;
/** How long the ball takes to open before idling open (its "open" animation). */
const OPEN_ANIMATION = "animation.poke_ball.open";

/** One item in a scene: its object (1 world unit tall, centred), its materials (to fade) and its motion. */
export interface Item {
  object: Object3D;
  materials: MeshBasicMaterial[];
  /** Animates the item at `time` seconds; `openedFor`: seconds since its details opened, or null. */
  update(time: number, openedFor: number | null): void;
}

type Parts = typeof import("@/components/carousel/threeParts");

/**
 * A flat pixel-art image as a Minecraft held item: the image itself on the front and back (its clear
 * pixels cut out), and around its outline a thin wall in each edge pixel's own colour. Returns the
 * shared geometries and texture, 1 world unit across its longer side, centred.
 */
function buildSprite(T: Parts, img: HTMLImageElement) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;
  const solid = (x: number, y: number) => x >= 0 && y >= 0 && x < w && y < h && data[(y * w + x) * 4 + 3] > 127;

  const s = 1 / Math.max(w, h);
  const d = (SPRITE_DEPTH_PX * s) / 2;
  const positions: number[] = [];
  const colors: number[] = [];
  const colour = new T.Color();
  /** One wall face (4 corners, any winding: its material is double-sided), in the current colour. */
  const quad = (corners: number[][], shade: number) => {
    for (const i of [0, 1, 2, 0, 2, 3]) {
      positions.push(...corners[i]);
      colors.push(colour.r * shade, colour.g * shade, colour.b * shade);
    }
  };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!solid(x, y)) continue;
    const i = (y * w + x) * 4;
    colour.setRGB(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255, T.SRGBColorSpace);
    const x0 = (x - w / 2) * s, x1 = x0 + s, y1 = (h / 2 - y) * s, y0 = y1 - s;
    if (!solid(x - 1, y)) quad([[x0, y0, -d], [x0, y0, d], [x0, y1, d], [x0, y1, -d]], SPRITE_SHADE.side);
    if (!solid(x + 1, y)) quad([[x1, y0, -d], [x1, y0, d], [x1, y1, d], [x1, y1, -d]], SPRITE_SHADE.side);
    if (!solid(x, y - 1)) quad([[x0, y1, -d], [x1, y1, -d], [x1, y1, d], [x0, y1, d]], SPRITE_SHADE.top);
    if (!solid(x, y + 1)) quad([[x0, y0, -d], [x1, y0, -d], [x1, y0, d], [x0, y0, d]], SPRITE_SHADE.bottom);
  }
  const sides = new T.BufferGeometry();
  sides.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  sides.setAttribute("color", new T.Float32BufferAttribute(colors, 3));

  const texture = new T.Texture(img);
  texture.magFilter = T.NearestFilter;
  texture.minFilter = T.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = T.SRGBColorSpace;
  texture.needsUpdate = true;
  return { face: new T.PlaneGeometry(w * s, h * s), sides, texture, depth: d };
}

/** Builds items of any kind; each `make` returns a fresh copy with its own fading materials. */
export async function createItemFactory() {
  const T = await import("@/components/carousel/threeParts");
  const { loadBedrockModel } = await import("./bedrockModel");
  const loadBall = (kind: BallKind) =>
    loadBedrockModel({
      geo: `${COBBLEMON}poke_ball.geo.json`,
      animations: `${COBBLEMON}poke_ball.animation.json`,
      texture: `${COBBLEMON}${kind}.png`,
    }).catch((error) => {
      console.warn(`${kind} model unavailable, a block replaces it`, error);
      return null;
    });
  const [blocks, spriteImages, ...ballModels] = await Promise.all([
    createBlockMaterials(),
    Promise.all(SPRITE_KINDS.map((kind) => loadImage(SPRITES[kind]))),
    ...BALL_KINDS.map(loadBall),
  ]);
  const balls = new Map(BALL_KINDS.map((kind, i) => [kind, ballModels[i]]));
  const sprites = new Map(SPRITE_KINDS.map((kind, i) => {
    const img = spriteImages[i];
    if (!img) console.warn(`${kind} image unavailable, a block replaces it`);
    return [kind, img ? buildSprite(T, img) : null];
  }));
  const anyBall = ballModels.find((b) => b) ?? null;
  const box = new T.BoxGeometry(1, 1, 1);
  const owned: MeshBasicMaterial[] = [];

  function makeBlock(kind: BlockKind): Item {
    const materials = blocks.materials.get(kind)!.map((m) => {
      const own = m.clone();
      own.transparent = true;
      owned.push(own);
      return own;
    });
    return { object: new T.Mesh(box, materials), materials, update() {} };
  }

  function makeSprite(parts: NonNullable<ReturnType<typeof buildSprite>>): Item {
    // Pixel art is fully clear or fully opaque. three.js tests alpha *after* the fade's opacity, so a
    // threshold near 0 (not 0.5) still cuts out the clear pixels while keeping a faded item's faces.
    const face = new T.MeshBasicMaterial({ map: parts.texture, alphaTest: SPRITE_ALPHA_TEST, transparent: true });
    const wall = new T.MeshBasicMaterial({ vertexColors: true, side: T.DoubleSide, transparent: true });
    owned.push(face, wall);
    const front = new T.Mesh(parts.face, face);
    front.position.z = parts.depth;
    const back = new T.Mesh(parts.face, face);
    back.position.z = -parts.depth;
    back.rotation.y = Math.PI; // the image mirrored, as seen from behind
    const object = new T.Group();
    object.add(front, back, new T.Mesh(parts.sides, wall));
    return { object, materials: [face, wall], update() {} };
  }

  return {
    /** Seconds a ball takes to open (0 when no ball model could load). */
    openSeconds: anyBall?.length(OPEN_ANIMATION) ?? 0,
    make(kind: ItemKind): Item {
      if (isSprite(kind)) {
        const parts = sprites.get(kind);
        return parts ? makeSprite(parts) : makeBlock("diamond");
      }
      const ball = isBall(kind) ? balls.get(kind) : null;
      if (!isBall(kind) || !ball) return makeBlock(isBall(kind) ? "diamond" : kind);
      const copy = ball.build();
      owned.push(copy.material);
      // Pixels → world units, centred on the ball (its geometry starts at y = 0).
      copy.root.scale.setScalar(1 / BALL_PX);
      copy.root.position.y = -0.5;
      const object = new T.Group();
      object.add(copy.root);
      const openLength = ball.length(OPEN_ANIMATION);
      return {
        object,
        materials: [copy.material],
        update(time, openedFor) {
          if (openedFor === null) copy.pose(["animation.poke_ball.shut_idle", time]);
          else if (openedFor < openLength) copy.pose([OPEN_ANIMATION, openedFor]);
          else copy.pose(["animation.poke_ball.open_idle", openedFor - openLength]);
        },
      };
    },
    dispose() {
      owned.forEach((m) => m.dispose());
      blocks.dispose();
      ballModels.forEach((b) => b?.dispose());
      sprites.forEach((parts) => {
        parts?.face.dispose();
        parts?.sides.dispose();
        parts?.texture.dispose();
      });
      box.dispose();
    },
  };
}

/** Draws single items onto 2D canvases (the open feature's item, the reduced-motion list). */
export async function createItemRenderer() {
  const T = await import("@/components/carousel/threeParts");
  const factory = await createItemFactory();

  const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene();
  // Orthographic, looking slightly down: the classic inventory-icon view.
  // A little room around the item: an open Poké Ball reaches past its own box.
  const camera = new T.OrthographicCamera(-1.25, 1.25, 1.25, -1.25, 0.1, 20);
  camera.position.set(0, 1.4, 4);
  camera.lookAt(0, 0, 0);
  const items = new Map<ItemKind, Item>();
  const itemOf = (kind: ItemKind) => {
    let item = items.get(kind);
    if (!item) {
      item = factory.make(kind);
      item.object.rotation.x = 0.35;
      scene.add(item.object);
      items.set(kind, item);
    }
    return item;
  };

  return {
    /** Renders `kind` turned by `angle` (radians) onto `canvas`, animated at `time` (see Item.update). */
    draw(canvas: HTMLCanvasElement, kind: ItemKind, angle: number, time = 0, openedFor: number | null = null) {
      const ctx = canvas.getContext("2d");
      if (!ctx || !canvas.width || !canvas.height) return;
      const item = itemOf(kind);
      renderer.setSize(canvas.width, canvas.height, false);
      items.forEach((it) => (it.object.visible = it === item));
      item.object.rotation.y = angle;
      item.update(time, openedFor);
      renderer.render(scene, camera);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(renderer.domElement, 0, 0);
    },
    dispose() {
      factory.dispose();
      renderer.dispose();
    },
  };
}
export type ItemRenderer = Awaited<ReturnType<typeof createItemRenderer>>;
export type ItemFactory = Awaited<ReturnType<typeof createItemFactory>>;
