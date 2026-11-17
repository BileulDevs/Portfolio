import type { MeshBasicMaterial, Object3D } from "@/components/carousel/threeParts";

/**
 * Minecraft-style blocks drawn as 3D items (the feature carousel of the Minecraft case study).
 * Items are blocks or Cobblemon models (a Poké Ball). Two uses: `createItemFactory` for items placed in
 * another scene (the carousel), and `createItemRenderer`, one WebGL renderer that draws single items
 * onto 2D canvases.
 * Textures are 16×16 pixel art generated here (seeded, so identical on every load), except the grass
 * side, which is the case study's own texture.
 */
export type BlockKind = "grass" | "log" | "diamond" | "gold" | "emerald" | "redstone" | "lapis" | "iron" | "coal";
export const BLOCK_KINDS: readonly BlockKind[] = ["grass", "log", "diamond", "gold", "emerald", "redstone", "lapis", "iron", "coal"];
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

/** The six faces of each block, in the order +x −x +y −y +z −z. */
function faces(kind: BlockKind, grassSide: HTMLImageElement | null): (HTMLCanvasElement | HTMLImageElement)[] {
  switch (kind) {
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
  const grassSide = await loadImage(GRASS_SIDE);
  const materials = new Map<BlockKind, MeshBasicMaterial[]>();
  for (const kind of BLOCK_KINDS) {
    materials.set(kind, faces(kind, grassSide).map((img, i) => {
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
export type ItemKind = BlockKind | BallKind;
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
  const [blocks, ...ballModels] = await Promise.all([createBlockMaterials(), ...BALL_KINDS.map(loadBall)]);
  const balls = new Map(BALL_KINDS.map((kind, i) => [kind, ballModels[i]]));
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

  return {
    /** Seconds a ball takes to open (0 when no ball model could load). */
    openSeconds: anyBall?.length(OPEN_ANIMATION) ?? 0,
    make(kind: ItemKind): Item {
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
