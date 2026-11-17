import { BALL_PX, COBBLEMON, createItemFactory, type ItemKind } from "./blockItems";
import { loadBedrockModel } from "./bedrockModel";
import { PX, SCENE_SCALE, SPECIES, createRoamer, type Area, type Companion, type Roamer } from "./pokemon";

export type { Companion } from "./pokemon";

/**
 * The open feature's little scene: its ball, closed again, and the Pokémon that came out of it,
 * roaming on their own with Cobblemon's animations (see pokemon.ts). Dragging swings the camera a
 * little (it eases back on release); clicking a Pokémon that has a cry plays it.
 * Sizes follow Minecraft and Cobblemon, so a big Pokémon makes the camera step back to fit it.
 */

/** Camera: what it looks at, its distance and height for small Pokémon, and how far a drag swings it. */
const LOOK_AT = { x: 0, y: 0.35, z: -0.1 };
const CAMERA = { distance: 7.6, height: 1.85 };
const MAX_SWING = 0.45;
const SWING_PER_PX = 0.004;
const SWING_EASE = 0.12;
const CLICK_SLOP_PX = 5;
/** Ball spot and roaming area (x, z) for small Pokémon, in world units; both grow with the tallest. */
const BALL_AT = { x: -1.15, z: 0 };
const ROAM: Area = { minX: -0.55, maxX: 1.05, minZ: -0.8, maxZ: 0.55 };
/** Height the framing above is made for: Pikachu's (28.5 model pixels, ears up). Taller Pokémon scale the set-up. */
const REFERENCE_HEIGHT = 28.5 * PX;
/** Share of the scene's growth the camera distance follows (below 1: big Pokémon fill more of the view). */
const CAMERA_FIT = 0.5;
/** Extra room per additional Pokémon (share of the single-Pokémon ground and camera distance). */
const CROWD_ROOM = 0.3;
/** Share of the scene's growth the ball follows (1 = true size relative to the Pokémon). */
const BALL_GROWTH = 0.8;
/** The closed ball's turn: its button (on its −z side) faces the camera, a little toward the right. */
const BALL_YAW = Math.PI + 0.55;
/** The first Pokémon comes out after this pause (time to see the ball), the next ones this many seconds apart. */
const SPAWN_START_S = 0.9;
const SPAWN_GAP_S = 0.45;
/** The ball opens a little before the first Pokémon pops out, and shuts once the last one has landed. */
const BALL_LEAD_S = 0.2;
const BALL_HOLD_S = 0.9;
/** Cobblemon's sound of a ball letting a Pokémon out, and its volume. */
const BALL_SOUND = { sound: `${COBBLEMON}sounds/poke_ball_send_out.ogg`, at: 0, volume: 0.7 };

/** Sound settings: on / off, and level from 0 to 1 (on top of each cry's own volume). */
export interface SoundSettings {
  on: boolean;
  level: number;
}
/** Labels of the cursor dot (CursorDot reads `data-cursor`): over a Pokémon, and elsewhere. */
export interface CursorLabels {
  pet: string;
  drag: string;
}

export async function createDetailScene(
  canvas: HTMLCanvasElement,
  kind: ItemKind,
  companions: Companion[],
  options: { sound: SoundSettings; cursor: CursorLabels },
) {
  const T = await import("@/components/carousel/threeParts");
  const [factory, ...models] = await Promise.all([
    createItemFactory(),
    ...companions.map((c) => loadBedrockModel(SPECIES[c].files)),
  ]);

  // Framing: everything grows with the tallest Pokémon, so it fits and the ball keeps its real size.
  const tallest = Math.max(...models.map((m, i) => m.height * PX * SPECIES[companions[i]].baseScale * SCENE_SCALE), REFERENCE_HEIGHT);
  const k = tallest / REFERENCE_HEIGHT;
  // Several Pokémon need room side by side: the ground widens (and the camera steps back) with each one.
  const crowd = 1 + CROWD_ROOM * (companions.length - 1);
  const area: Area = { minX: ROAM.minX * k * crowd, maxX: ROAM.maxX * k * crowd, minZ: ROAM.minZ * k * crowd, maxZ: ROAM.maxZ * k * crowd };
  const ballAt = { x: BALL_AT.x * k * crowd, z: BALL_AT.z * k };
  const lookAt = { x: LOOK_AT.x, y: LOOK_AT.y * k, z: LOOK_AT.z * k };
  // The camera frames a little tighter than the ground grows: big Pokémon may fill the view.
  const view = 1 + (k * crowd - 1) * CAMERA_FIT; // 1 for Pikachu alone: its framing stays as it was

  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 50 * view);
  let swing = 0;
  let swingTarget = 0;
  function placeCamera() {
    const d = CAMERA.distance * view;
    camera.position.set(lookAt.x + Math.sin(swing) * d, CAMERA.height * view, lookAt.z + Math.cos(swing) * d);
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  }
  placeCamera();

  const ball = factory.make(kind);
  // At true size the ball would be a speck beside big Pokémon: it grows a little with the scene.
  const ballSize = BALL_PX * PX * Math.max(1, k * BALL_GROWTH);
  ball.object.scale.setScalar(ballSize);
  ball.object.position.set(ballAt.x, ballSize / 2, ballAt.z);
  ball.object.rotation.y = BALL_YAW;
  scene.add(ball.object);

  // Each Pokémon lands on its own spot, spread across the area, then roams.
  const roamers: Roamer[] = companions.map((c, i) => {
    const group = new T.Group();
    scene.add(group);
    const share = companions.length === 1 ? 0.15 : i / (companions.length - 1);
    const landing = { x: area.minX + (area.maxX - area.minX) * (0.1 + 0.8 * share), z: (i % 2 ? area.minZ : area.maxZ) * 0.5 };
    return createRoamer(models[i], SPECIES[c], group, ballAt, landing, SPAWN_START_S + i * SPAWN_GAP_S);
  });

  let sound = options.sound;
  const cries = new Map<string, HTMLAudioElement>();
  const cryTimers: number[] = [];
  function playCry(cry: { sound: string; at: number; volume: number }) {
    let audio = cries.get(cry.sound);
    if (!audio) cries.set(cry.sound, (audio = new Audio(cry.sound)));
    const clip = audio;
    cryTimers.push(window.setTimeout(() => {
      if (!sound.on || sound.level <= 0) return;
      clip.volume = Math.min(1, cry.volume * sound.level);
      clip.currentTime = 0;
      clip.play().catch(() => {}); // muted tab or blocked audio: the animation alone still plays
    }, cry.at * 1000));
  }

  // ---- Input: drag to swing the camera, click a Pokémon to make it cry -----------------------------
  const ray = new T.Raycaster();
  const pointer = new T.Vector2();
  /** The Pokémon under the pointer, if any (canvas pixels → ray from the camera). */
  function pokemonAt(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(roamers.map((m) => m.body), true)[0];
    return hit ? roamers.find((m) => m.body === hit.object || m.body.getObjectById(hit.object.id)) ?? null : null;
  }
  let drag: { x: number; from: number; moved: boolean } | null = null;
  function onDown(e: PointerEvent) {
    if (e.button !== 0) return;
    try {
      canvas.setPointerCapture(e.pointerId); // keep the drag when the pointer leaves the canvas
    } catch {
      // pointer already released (or synthetic): the drag still works inside the canvas
    }
    drag = { x: e.clientX, from: swing, moved: false };
  }
  function onMove(e: PointerEvent) {
    if (!drag) {
      const over = pokemonAt(e);
      canvas.style.cursor = over ? "pointer" : "grab";
      canvas.dataset.cursor = over ? options.cursor.pet : options.cursor.drag;
      return;
    }
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > CLICK_SLOP_PX) drag.moved = true;
    swingTarget = Math.max(-MAX_SWING, Math.min(MAX_SWING, drag.from - dx * SWING_PER_PX));
    canvas.style.cursor = "grabbing";
  }
  function onUp(e: PointerEvent) {
    const click = drag && !drag.moved;
    drag = null;
    swingTarget = 0; // released: the camera eases back to its original view
    canvas.style.cursor = "grab";
    const mon = click ? pokemonAt(e) : null;
    if (mon?.canCry()) {
      const cry = mon.cry(sceneTime);
      if (cry) playCry(cry);
    }
  }
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.style.cursor = "grab";
  canvas.dataset.cursor = options.cursor.drag;
  canvas.dataset.cursorSize = "small"; // a small pill, so the label does not hide the Pokémon
  canvas.style.touchAction = "pan-y";

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  let start = 0;
  let last = 0;
  let sceneTime = 0;
  /** When the ball opens and shuts again (scene seconds), and whether its sound has played. */
  const ballOpensAt = SPAWN_START_S - BALL_LEAD_S;
  const ballShutsAt = SPAWN_START_S + (companions.length - 1) * SPAWN_GAP_S + BALL_HOLD_S;
  let ballSounded = false;

  return {
    /** Applies new sound settings: the level counts from the next cry; turning off stops any cry now. */
    setSound(next: SoundSettings) {
      sound = next;
      if (!next.on) cries.forEach((audio) => audio.pause());
    },
    /** Advances and draws the scene; `now` in milliseconds (performance clock). */
    tick(now: number) {
      if (!start) start = last = now;
      sceneTime = (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      roamers.forEach((m) => m.update(sceneTime, dt, area, roamers.filter((o) => o !== m)));
      const ballOpen = sceneTime >= ballOpensAt && sceneTime < ballShutsAt;
      ball.update(sceneTime, ballOpen ? sceneTime - ballOpensAt : null);
      if (ballOpen && !ballSounded) {
        ballSounded = true;
        playCry(BALL_SOUND);
      }
      swing += (swingTarget - swing) * Math.min(1, SWING_EASE * dt * 60);
      placeCamera();
      renderer.render(scene, camera);
    },
    dispose() {
      cryTimers.forEach((id) => clearTimeout(id));
      cries.forEach((audio) => audio.pause());
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      observer.disconnect();
      roamers.forEach((m) => m.dispose());
      models.forEach((m) => m.dispose());
      factory.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
export type DetailScene = Awaited<ReturnType<typeof createDetailScene>>;
