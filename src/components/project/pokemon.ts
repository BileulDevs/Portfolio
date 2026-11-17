import type { Group } from "@/components/carousel/threeParts";
import { COBBLEMON } from "./blockItems";
import type { BedrockModel } from "./bedrockModel";

/**
 * Pokémon that can roam a feature's scene: Cobblemon's files for each, and a small behaviour that
 * pops it out of the ball, then alternates idling (with blinks) and walking to free spots.
 * Sizes follow Cobblemon: 16 model pixels = 1 block, times the species' `baseScale`.
 */
export type Companion = "pikachu" | "chansey" | "kangaskhan" | "tauros";

export interface Species {
  /** Folder under public/projects/cobblemon-mods/cobblemon/, and file names inside it. */
  files: { geo: string; animations: string; texture: string };
  /** Cobblemon's `baseScale` (from the species data): how big the model is drawn in game. */
  scale: number;
  /** Bones only shown by Cobblemon for an expression, which would otherwise show through. */
  hide?: RegExp;
  anim: { idle: string; walk: string; blink?: string; cry?: string };
  /** Cry sound, when it starts in the cry animation (seconds) and its volume. */
  cry?: { sound: string; at: number; volume: number };
  /** Walking speed (blocks per second) and the distance one walk loop covers, so feet match the ground. */
  speed: number;
  stride: number;
}

const files = (dir: string, geo: string, name: string) => ({
  geo: `${COBBLEMON}${dir}/${geo}.geo.json`,
  animations: `${COBBLEMON}${dir}/${name}.animation.json`,
  texture: `${COBBLEMON}${dir}/${name}.png`,
});
const anims = (name: string, extra: Partial<Species["anim"]> = {}): Species["anim"] => ({
  idle: `animation.${name}.ground_idle`,
  walk: `animation.${name}.ground_walk`,
  blink: `animation.${name}.blink`,
  ...extra,
});

export const SPECIES: Record<Companion, Species> = {
  pikachu: {
    files: files("pikachu", "pikachu_male", "pikachu"),
    scale: 1,
    // Emote eyes, sparking cheeks and teeth; the open mouth stays (the cry brings it forward).
    hide: /^(acting_teeth|eye_emote_|eyeshine_(right|left)2|eyelid_emote_|cheek_active_)/,
    anim: anims("pikachu", { cry: "animation.pikachu.cry" }),
    cry: { sound: `${COBBLEMON}pikachu/pikachu_cry.ogg`, at: 0.5, volume: 0.8 },
    speed: 0.55,
    stride: 0.55,
  },
  chansey: {
    files: files("chansey", "chansey", "chansey"),
    scale: 1,
    anim: anims("chansey"),
    speed: 0.5,
    stride: 0.6,
  },
  kangaskhan: {
    files: files("kangaskhan", "kangaskhan", "kangaskhan"),
    scale: 1,
    anim: anims("kangaskhan"),
    speed: 0.6,
    stride: 0.9,
  },
  tauros: {
    files: files("tauros", "tauros", "tauros"),
    scale: 1,
    anim: anims("tauros"),
    speed: 0.8,
    stride: 1.1,
  },
};

/** World units per model pixel (Minecraft scale). */
export const PX = 1 / 16;
/** Bedrock models face −z: half a turn makes heading 0 face the camera (+z). */
const MODEL_YAW = Math.PI;
const SPAWN_S = 0.6;
const IDLE_S: [number, number] = [1.4, 3.6];
const TURN = 0.12;
const BLINK_EVERY: [number, number] = [2.5, 6];
/** Tries to find a walking target this far from the other Pokémon (in their own sizes). */
const TARGET_TRIES = 12;

const between = ([a, b]: [number, number]) => a + Math.random() * (b - a);
export interface Area {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/** One Pokémon roaming the scene. `body` is what to add to the scene and to hit-test. */
export function createRoamer(model: BedrockModel, species: Species, group: Group, from: { x: number; z: number }, landing: { x: number; z: number }, delay: number) {
  const mon = model.build({ hide: species.hide });
  mon.root.scale.setScalar(PX * species.scale);
  group.add(mon.root);
  group.position.set(from.x, 0, from.z);
  group.scale.setScalar(0.001);

  let state: "wait" | "spawn" | "idle" | "walk" | "cry" = "wait";
  let since = 0;
  let stateUntil = 0;
  let target = { ...landing };
  let heading = 0;
  let walked = 0;
  let nextBlink = between(BLINK_EVERY);
  let blinkAt = -1;
  /** Footprint radius (world units), to keep the others at a distance. */
  const radius = Math.max(0.25, (model.height * PX * species.scale) / 2.5);

  return {
    body: group,
    radius,
    get position() {
      return { x: group.position.x, z: group.position.z };
    },
    get target() {
      return target;
    },
    canCry: () => Boolean(species.anim.cry) && (state === "idle" || state === "walk"),
    /** Stops, turns to the camera and plays the cry animation; returns the sound to play, if any. */
    cry(t: number) {
      state = "cry";
      since = t;
      return species.cry ?? null;
    },
    /** Advances its behaviour by `dt` at scene time `t`; `area` and `others` bound where it walks. */
    update(t: number, dt: number, area: Area, others: { position: { x: number; z: number }; target: { x: number; z: number }; radius: number }[]) {
      if (state === "wait") {
        if (t < delay) return;
        state = "spawn";
        since = t;
      }
      if (state === "spawn") {
        // Grows out of the ball with a hop to its landing spot.
        const k = Math.min(1, (t - since) / SPAWN_S);
        const ease = 1 - (1 - k) ** 3;
        group.scale.setScalar(0.05 + 0.95 * ease);
        group.position.set(from.x + (landing.x - from.x) * ease, Math.sin(k * Math.PI) * 0.3, from.z + (landing.z - from.z) * ease);
        if (k >= 1) {
          state = "idle";
          stateUntil = t + between(IDLE_S);
        }
      } else if (state === "cry" && t - since >= model.length(species.anim.cry ?? "")) {
        state = "idle";
        stateUntil = t + between(IDLE_S);
      } else if (state === "idle" && t >= stateUntil) {
        // A free spot: not on top of where the others are or are heading.
        for (let i = 0; i < TARGET_TRIES; i++) {
          target = { x: area.minX + Math.random() * (area.maxX - area.minX), z: area.minZ + Math.random() * (area.maxZ - area.minZ) };
          const clear = others.every((o) => {
            const gap = radius + o.radius;
            return Math.hypot(target.x - o.target.x, target.z - o.target.z) > gap && Math.hypot(target.x - o.position.x, target.z - o.position.z) > gap;
          });
          if (clear) break;
        }
        state = "walk";
      } else if (state === "walk") {
        const dx = target.x - group.position.x, dz = target.z - group.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.03) {
          state = "idle";
          stateUntil = t + between(IDLE_S);
        } else {
          const step = Math.min(dist, species.speed * dt);
          group.position.x += (dx / dist) * step;
          group.position.z += (dz / dist) * step;
          walked += step;
          const want = Math.atan2(dx, dz); // heading 0 = facing +z, the camera
          heading += Math.atan2(Math.sin(want - heading), Math.cos(want - heading)) * Math.min(1, TURN * dt * 60);
        }
      }
      if (state !== "walk") heading += Math.atan2(Math.sin(-heading), Math.cos(-heading)) * Math.min(1, TURN * 0.4 * dt * 60);
      group.rotation.y = heading + MODEL_YAW;

      const { anim } = species;
      if (anim.blink && t >= nextBlink) {
        blinkAt = t;
        nextBlink = t + between(BLINK_EVERY);
      }
      const layers: [string, number][] = [state === "walk" ? [anim.walk, walked / species.stride] : [anim.idle, t]];
      if (state === "cry" && anim.cry) layers.push([anim.cry, t - since]);
      if (anim.blink && blinkAt >= 0 && t - blinkAt < model.length(anim.blink)) layers.push([anim.blink, t - blinkAt]);
      mon.pose(...layers);
    },
    dispose() {
      mon.material.dispose();
    },
  };
}
export type Roamer = ReturnType<typeof createRoamer>;
