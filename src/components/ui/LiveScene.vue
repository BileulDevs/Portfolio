<script setup lang="ts">
import type { ArtStyle } from "@/data/types";
import { SKY_BOTTOM, SKY_TOP } from "@/utils/projectArt";

/**
 * Moving details of a cover's artwork, in CSS only (transform + opacity, so the browser animates
 * them off the main thread). Same look and timing as the carousel's shader. Positions are the
 * painter's fractions of the picture; sizes use container units (cqw / cqh) to hold at any size.
 * Two layers around the picture (z-index 1): "back" (sky and clouds, which the terrain and the
 * tree then cover) and "front" (shooting stars, monitor sweep, steam).
 */
defineProps<{ art: ArtStyle }>();

const METEORS = [
  { left: "84%", top: "8%", duration: "3.5s", delay: "0s" },
  { left: "62%", top: "2%", duration: "5s", delay: "-1.8s" },
  { left: "97%", top: "22%", duration: "6.5s", delay: "-3.7s" },
];
/** Block clouds: height from the top, width in blocks, crossing time, phase. */
const CLOUDS = [
  { top: "12%", blocks: 5, duration: "28s", delay: "-5s" },
  { top: "20%", blocks: 4, duration: "38s", delay: "-21s" },
  { top: "7%", blocks: 3, duration: "22s", delay: "-17s" },
];
</script>

<template>
  <div class="live" aria-hidden="true">
    <div v-if="art === 'blocks'" class="back" :style="{ background: `linear-gradient(${SKY_TOP}, ${SKY_BOTTOM})` }">
      <i v-for="(c, i) in CLOUDS" :key="i" class="cloud" :style="{ top: c.top, '--n': c.blocks, animationDuration: c.duration, animationDelay: c.delay }" />
    </div>
    <div class="front">
      <template v-if="art === 'night'">
        <i
          v-for="(m, i) in METEORS"
          :key="i"
          class="meteor"
          :style="{ left: m.left, top: m.top, animationDuration: m.duration, animationDelay: m.delay }"
        />
      </template>
      <template v-else-if="art === 'office'">
        <!-- The monitor's screen (painter: x 44 → 82%, y 15.6 → 54.4%) and the mug (x ≈ 86%, top 71%). -->
        <div class="screen"><i class="sweep" /></div>
        <i class="steam" />
        <i class="steam second" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.live { position: absolute; inset: 0; container-type: size; pointer-events: none; }
.back, .front { position: absolute; inset: 0; overflow: hidden; }
.back { z-index: 0; }
.front { z-index: 2; }

/* ---- Night: shooting stars (head on the left, trail up and to the right, 24.8°) ---- */
.meteor {
  position: absolute;
  width: 18cqw;
  height: max(2px, .28cqw);
  border-radius: 999px;
  transform-origin: left center;
  background: linear-gradient(90deg, rgba(236, 239, 249, .95), rgba(182, 170, 255, .45) 25%, rgba(139, 124, 246, 0));
  opacity: 0;
  animation: meteor linear infinite;
}
.meteor::before {
  content: "";
  position: absolute;
  left: -.9cqw;
  top: 50%;
  width: 1.8cqw;
  height: 1.8cqw;
  translate: 0 -50%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, .9), rgba(255, 255, 255, 0) 70%);
}
@keyframes meteor {
  0% { opacity: 0; transform: translate(0, 0) rotate(-24.8deg); }
  3% { opacity: 1; }
  17% { opacity: 1; }
  22% { opacity: 0; transform: translate(-34cqw, 15.7cqw) rotate(-24.8deg); }
  100% { opacity: 0; transform: translate(-34cqw, 15.7cqw) rotate(-24.8deg); }
}

/* ---- Office: refresh sweep on the monitor, steam over the mug ---- */
.screen { position: absolute; left: 44%; top: 15.6%; width: 38%; height: 38.8%; overflow: hidden; container-type: size; }
.sweep {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 26cqw;
  background: linear-gradient(90deg, transparent, rgba(182, 205, 232, .34), transparent);
  animation: sweep 3.5s linear infinite;
}
@keyframes sweep { from { transform: translateX(-26cqw); } to { transform: translateX(100cqw); } }
.steam {
  position: absolute;
  left: 85.6%;
  top: 64%;
  width: 1.8cqw;
  height: 9cqh;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255, 255, 255, .75), rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  animation: steam 2.6s ease-out infinite;
}
.steam.second { left: 86.6%; animation-delay: -1.3s; }
@keyframes steam {
  0% { opacity: 0; transform: translate(0, 2cqh) scaleX(1); }
  25% { opacity: .9; }
  60% { transform: translate(.6cqw, -5cqh) scaleX(1.4); }
  100% { opacity: 0; transform: translate(-.3cqw, -15cqh) scaleX(1.8); }
}

/* ---- Blocks: clouds drifting across the sky, behind the terrain (block = 1/32 of the width) ---- */
.cloud {
  --block: calc(100cqw / 32);
  position: absolute;
  left: 0;
  width: calc(var(--n) * var(--block));
  height: calc(.8 * var(--block));
  background: rgba(255, 255, 255, .92);
  animation: drift linear infinite;
}
.cloud::before {
  content: "";
  position: absolute;
  left: var(--block);
  top: calc(-.6 * var(--block));
  width: calc((var(--n) - 2) * var(--block));
  height: calc(.7 * var(--block));
  background: inherit;
}
@keyframes drift { from { transform: translateX(-20cqw); } to { transform: translateX(110cqw); } }
</style>
