import type { ArtStyle, Project } from "@/data/types";

/** Palette mirrored from tokens.css; canvas cannot read CSS variables cheaply. */
export const PALETTE = {
  base: "#475465",
  deep: "#2c3542",
  slate: "#556C96",
  mist: "#B6CDE8",
  lav: "#EEEDFF",
  coral: "#FF584D",
  ink: "#1f2630",
} as const;

/** Park–Miller PRNG: the same seed always paints the same artwork. */
function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/**
 * Where the moving details are animated on top of the picture, so the picture leaves them out:
 * "panel" = the carousel's shader (shooting stars, clouds), "cover" = CSS layers (LiveScene.vue),
 * which also need a transparent sky to slide clouds behind the terrain. Absent = everything still.
 */
export type Live = "panel" | "cover";
type Painter = (g: CanvasRenderingContext2D, w: number, h: number, rnd: () => number, o: { live?: Live }) => void;

/** Rounded rectangle filled with the current fill style. */
function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}

/** A shooting star: bright head at (x, y), a trail fading up and to the right. */
function shootingStar(g: CanvasRenderingContext2D, x: number, y: number, length: number, angle: number, width: number) {
  const tx = x + Math.cos(angle) * length, ty = y - Math.sin(angle) * length;
  const trail = g.createLinearGradient(x, y, tx, ty);
  trail.addColorStop(0, "rgba(236,239,249,.95)");
  trail.addColorStop(0.25, "rgba(182,170,255,.45)");
  trail.addColorStop(1, "rgba(139,124,246,0)");
  g.strokeStyle = trail;
  g.lineWidth = width;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(tx, ty);
  g.stroke();
  const glow = g.createRadialGradient(x, y, 0, x, y, width * 5);
  glow.addColorStop(0, "rgba(255,255,255,.9)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = glow;
  g.beginPath();
  g.arc(x, y, width * 5, 0, Math.PI * 2);
  g.fill();
}

/** Minecraft sky, top and bottom of the gradient (also used by LiveScene.vue behind covers). */
export const SKY_TOP = "#7ea8f2";
export const SKY_BOTTOM = "#c9dcfb";

const PAINTERS: Record<ArtStyle, Painter> = {
  // Noxtys: the night sky of noxtys.com: deep blue-black, violet glow, stars, shooting stars, a horizon.
  night(g, w, h, rnd, o) {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#04060d");
    sky.addColorStop(0.65, "#0a0f1e");
    sky.addColorStop(1, "#161d3a");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    const glow = g.createRadialGradient(w * 0.78, h * 0.05, 0, w * 0.78, h * 0.05, w * 0.6);
    glow.addColorStop(0, "rgba(139,124,246,.28)");
    glow.addColorStop(1, "rgba(139,124,246,0)");
    g.fillStyle = glow;
    g.fillRect(0, 0, w, h);

    // Stars: mostly fine dust, a few brighter ones, some gold (the site's accent).
    for (let k = 0; k < 420; k++) {
      const big = rnd() > 0.93;
      const r = (big ? 1.6 + rnd() * 1.6 : 0.6 + rnd() * 0.9) * (w / 1600);
      g.fillStyle = rnd() > 0.93 ? `rgba(226,180,90,${0.5 + rnd() * 0.5})` : `rgba(236,239,249,${0.25 + rnd() * 0.75})`;
      g.beginPath();
      g.arc(rnd() * w, rnd() * h * 0.85, r, 0, Math.PI * 2);
      g.fill();
    }
    // Shooting stars, all falling the same way (head low-left, trail up-right). Still on covers;
    // on carousel panels the shader draws moving ones instead.
    if (!o.live) {
      const u = w / 1600;
      shootingStar(g, w * 0.55, h * 0.36, w * 0.3, 0.42, 3.2 * u);
      shootingStar(g, w * 0.8, h * 0.2, w * 0.16, 0.42, 2.2 * u);
      shootingStar(g, w * 0.3, h * 0.16, w * 0.1, 0.42, 1.6 * u);
    }

    // Low dark hills on the horizon: the place you watch the sky from.
    g.fillStyle = "#03050b";
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += w / 40) g.lineTo(x, h * (0.8 + Math.sin(x / w * 5 + 1) * 0.035 + rnd() * 0.01));
    g.lineTo(w, h);
    g.fill();
  },

  // Athlon: an office: window on the city, desk, monitor showing the monitoring dashboard, lamp, plant.
  office(g, w, h, rnd) {
    g.fillStyle = PALETTE.base;
    g.fillRect(0, 0, w, h);
    const u = w / 1600;

    // Window: sky, a few towers, frame and mullions.
    const wx = w * 0.06, wy = h * 0.1, ww = w * 0.26, wh = h * 0.42;
    const out = g.createLinearGradient(0, wy, 0, wy + wh);
    out.addColorStop(0, PALETTE.lav);
    out.addColorStop(1, PALETTE.mist);
    g.fillStyle = out;
    g.fillRect(wx, wy, ww, wh);
    g.fillStyle = "rgba(85,108,150,.55)";
    for (let i = 0; i < 6; i++) {
      const bw = ww * (0.1 + rnd() * 0.08), bh = wh * (0.25 + rnd() * 0.45);
      g.fillRect(wx + (ww / 6) * i + rnd() * 6 * u, wy + wh - bh, bw, bh);
    }
    g.strokeStyle = PALETTE.deep;
    g.lineWidth = 10 * u;
    g.strokeRect(wx, wy, ww, wh);
    g.lineWidth = 6 * u;
    g.beginPath();
    g.moveTo(wx + ww / 2, wy);
    g.lineTo(wx + ww / 2, wy + wh);
    g.moveTo(wx, wy + wh / 2);
    g.lineTo(wx + ww, wy + wh / 2);
    g.stroke();

    // Desk.
    const deskY = h * 0.68;
    g.fillStyle = "#323c4b";
    g.fillRect(0, deskY, w, h - deskY);
    g.fillStyle = PALETTE.deep;
    g.fillRect(0, deskY, w, h * 0.035);

    // Monitor: stand, bezel, and the dashboard on screen.
    const mx = w * 0.43, my = h * 0.14, mw = w * 0.4, mh = h * 0.42;
    g.fillStyle = PALETTE.deep;
    g.fillRect(mx + mw / 2 - 14 * u, my + mh, 28 * u, deskY - my - mh);
    roundRect(g, mx + mw / 2 - 90 * u, deskY - 14 * u, 180 * u, 14 * u, 4 * u);
    g.fillStyle = PALETTE.ink;
    roundRect(g, mx, my, mw, mh, 14 * u);
    const sx = mx + 16 * u, sy = my + 16 * u, sw = mw - 32 * u, sh = mh - 32 * u;
    g.fillStyle = "#262f3c";
    g.fillRect(sx, sy, sw, sh);
    g.fillStyle = "rgba(182,205,232,.25)";
    g.fillRect(sx, sy, sw, sh * 0.08);
    const rows = 5, cols = 22, cw = sw / cols, rh = (sh * 0.55) / rows;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const v = rnd();
        g.fillStyle = v > 0.97 ? PALETTE.coral : v > 0.45 ? PALETTE.mist : "rgba(182,205,232,.45)";
        g.fillRect(sx + c * cw + 2 * u, sy + sh * 0.14 + r * rh, cw - 4 * u, rh * 0.6);
      }
    g.strokeStyle = PALETTE.coral;
    g.lineWidth = 3.5 * u;
    g.lineJoin = "round";
    g.beginPath();
    const base = sy + sh * 0.86;
    for (let x = 0; x <= sw; x += sw / 40) {
      const spike = Math.abs(x - sw * 0.62) < sw / 30 ? -sh * 0.16 : (rnd() - 0.5) * sh * 0.03;
      g.lineTo(sx + x, base + spike);
    }
    g.stroke();

    // Keyboard and mug.
    g.fillStyle = PALETTE.mist;
    roundRect(g, mx + mw * 0.2, deskY + h * 0.05, mw * 0.6, h * 0.035, 6 * u);
    g.fillStyle = PALETTE.coral;
    roundRect(g, mx + mw + w * 0.02, deskY + h * 0.03, w * 0.03, h * 0.07, 5 * u);

    // Lamp: base, arm, shade, and its soft light.
    const lx = w * 0.92;
    const light = g.createRadialGradient(lx - w * 0.04, h * 0.3, 0, lx - w * 0.04, h * 0.3, h * 0.45);
    light.addColorStop(0, "rgba(255,226,180,.25)");
    light.addColorStop(1, "rgba(255,226,180,0)");
    g.fillStyle = light;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = PALETTE.deep;
    g.lineWidth = 10 * u;
    g.beginPath();
    g.moveTo(lx, deskY);
    g.lineTo(lx, h * 0.38);
    g.lineTo(lx - w * 0.04, h * 0.24);
    g.stroke();
    g.fillStyle = PALETTE.coral;
    g.beginPath();
    g.moveTo(lx - w * 0.075, h * 0.29);
    g.lineTo(lx - w * 0.005, h * 0.29);
    g.lineTo(lx - w * 0.025, h * 0.19);
    g.lineTo(lx - w * 0.055, h * 0.19);
    g.fill();

    // Plant on the windowsill side of the desk.
    const px = w * 0.34;
    g.fillStyle = PALETTE.slate;
    for (let k = 0; k < 7; k++) {
      const a = -Math.PI / 2 + (k - 3) * 0.32;
      g.beginPath();
      g.ellipse(px + Math.cos(a) * 34 * u, deskY - h * 0.1 + Math.sin(a) * 40 * u, 16 * u, 42 * u, a + Math.PI / 2, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = PALETTE.coral;
    roundRect(g, px - 30 * u, deskY - h * 0.08, 60 * u, h * 0.08, 6 * u);
  },

  // Observatory: a star system seen from afar: nebula glow, a star on the left, orbits, and a
  // banded, ringed planet on the right (clear of the title, bottom-left).
  space(g, w, h, rnd, o) {
    const u = w / 1600;
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#05070f");
    sky.addColorStop(0.6, "#0b1124");
    sky.addColorStop(1, "#141a33");
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    for (const [x, y, r, color] of [[0.3, 0.25, 0.45, "rgba(139,124,246,.2)"], [0.62, 0.12, 0.3, "rgba(255,88,77,.09)"]] as const) {
      const neb = g.createRadialGradient(w * x, h * y, 0, w * x, h * y, w * r);
      neb.addColorStop(0, color);
      neb.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = neb;
      g.fillRect(0, 0, w, h);
    }
    for (let k = 0; k < 480; k++) {
      const big = rnd() > 0.94;
      g.fillStyle = `rgba(236,239,249,${0.2 + rnd() * 0.8})`;
      g.beginPath();
      g.arc(rnd() * w, rnd() * h, (big ? 1.5 + rnd() * 1.4 : 0.5 + rnd() * 0.8) * u, 0, Math.PI * 2);
      g.fill();
    }

    // The star, half off-canvas on the left, and the orbits around it.
    const sx = -w * 0.04, sy = h * 0.5;
    const sun = g.createRadialGradient(sx, sy, 0, sx, sy, w * 0.32);
    sun.addColorStop(0, "rgba(255,236,200,1)");
    sun.addColorStop(0.18, "rgba(255,196,130,.75)");
    sun.addColorStop(1, "rgba(255,150,90,0)");
    g.fillStyle = sun;
    g.fillRect(0, 0, w, h);
    g.lineWidth = 1.3 * u;
    for (const [rx, t] of [[0.34, 1.1], [0.55, 0.35], [0.8, 0.62]] as const) {
      g.strokeStyle = "rgba(182,205,232,.2)";
      g.beginPath();
      g.ellipse(sx, sy, w * rx, w * rx * 0.3, -0.1, 0, Math.PI * 2);
      g.stroke();
      // A small planet on each orbit.
      const px = sx + Math.cos(t) * w * rx * Math.cos(-0.1) - Math.sin(t) * w * rx * 0.3 * Math.sin(-0.1);
      const py = sy + Math.cos(t) * w * rx * Math.sin(-0.1) + Math.sin(t) * w * rx * 0.3 * Math.cos(-0.1);
      g.fillStyle = PALETTE.mist;
      g.beginPath();
      g.arc(px, py, (5 + rnd() * 5) * u, 0, Math.PI * 2);
      g.fill();
    }

    // The ringed planet: back half of the ring, banded body lit from the star's side, front half.
    const cx = w * 0.73, cy = h * 0.5, r = h * 0.26, tilt = -0.28;
    const ring = (from: number, to: number) => {
      for (const [k, color] of [[2.25, "rgba(255,88,77,.55)"], [1.95, "rgba(238,237,255,.45)"], [1.7, "rgba(182,205,232,.35)"]] as const) {
        g.strokeStyle = color;
        g.lineWidth = r * 0.12;
        g.beginPath();
        g.ellipse(cx, cy, r * k, r * k * 0.24, tilt, from, to);
        g.stroke();
      }
    };
    ring(Math.PI, Math.PI * 2);
    g.save();
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = "#7f98c2";
    g.fillRect(cx - r, cy - r, r * 2, r * 2);
    const BANDS = ["#b6cde8", "#556c96", "#9db3d6", "#475465", "#c7d6ec"];
    for (let y = cy - r; y < cy + r; y += r * (0.1 + rnd() * 0.12)) {
      g.fillStyle = BANDS[Math.floor(rnd() * BANDS.length)];
      g.globalAlpha = 0.35 + rnd() * 0.35;
      g.fillRect(cx - r, y, r * 2, r * (0.04 + rnd() * 0.08));
    }
    g.globalAlpha = 1;
    const shade = g.createLinearGradient(cx - r, cy - r * 0.4, cx + r, cy + r * 0.4);
    shade.addColorStop(0, "rgba(5,7,15,0)");
    shade.addColorStop(0.55, "rgba(5,7,15,.35)");
    shade.addColorStop(1, "rgba(5,7,15,.9)");
    g.fillStyle = shade;
    g.fillRect(cx - r, cy - r, r * 2, r * 2);
    g.restore();
    g.strokeStyle = "rgba(182,205,232,.4)";
    g.lineWidth = 2 * u;
    g.beginPath();
    g.arc(cx, cy, r, Math.PI * 0.55, Math.PI * 1.45);
    g.stroke();
    ring(0, Math.PI);

    // Still shooting stars on covers; on carousel panels the shader draws moving ones instead.
    if (!o.live) {
      shootingStar(g, w * 0.5, h * 0.2, w * 0.18, 0.42, 2.4 * u);
      shootingStar(g, w * 0.9, h * 0.1, w * 0.08, 0.42, 1.6 * u);
    }
  },

  // Minecraft mods: a blocky landscape: sky, square sun, block clouds, grass / dirt / stone, a tree.
  blocks(g, w, h, rnd, o) {
    // On covers the sky (and its clouds) is a CSS layer behind the picture.
    if (o.live !== "cover") {
      const sky = g.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, SKY_TOP);
      sky.addColorStop(1, SKY_BOTTOM);
      g.fillStyle = sky;
      g.fillRect(0, 0, w, h);
    }

    const S = w / 32; // block size
    // Square sun with a halo.
    g.fillStyle = "rgba(255,243,176,.35)";
    g.fillRect(w * 0.76 - S * 0.6, h * 0.1 - S * 0.6, S * 3.2, S * 3.2);
    g.fillStyle = "#fff3b0";
    g.fillRect(w * 0.76, h * 0.1, S * 2, S * 2);
    // Clouds made of blocks (drifting ones are drawn by the carousel shader or LiveScene instead).
    if (!o.live) {
      g.fillStyle = "rgba(255,255,255,.92)";
      for (const [cx, cy, n] of [[0.12, 0.12, 5], [0.42, 0.2, 4], [0.58, 0.07, 3]] as const) {
        g.fillRect(w * cx, h * cy, S * n, S * 0.8);
        g.fillRect(w * cx + S, h * cy - S * 0.6, S * (n - 2), S * 0.7);
      }
    }

    // Terrain heights: a gentle walk, snapped to the block grid.
    const cols = Math.ceil(w / S);
    const heights: number[] = [];
    let level = 7;
    for (let c = 0; c < cols; c++) {
      if (rnd() > 0.6) level += rnd() > 0.5 ? 1 : -1;
      level = Math.min(9, Math.max(5, level));
      heights.push(level);
    }
    const ground = (c: number) => h - heights[c] * S;
    /** One block with a light pixel texture (4 × 4 sub-pixels shaded at random). */
    const block = (x: number, y: number, colors: string[]) => {
      const p = S / 4;
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++) {
          g.fillStyle = colors[Math.floor(rnd() * colors.length)];
          g.fillRect(x + i * p, y + j * p, p + 0.5, p + 0.5);
        }
    };
    const GRASS = ["#6aa83a", "#5f9b33", "#78b545"];
    const DIRT = ["#866043", "#79553a", "#8f6a4b"];
    const STONE = ["#7d7d7d", "#727272", "#888888"];
    for (let c = 0; c < cols; c++) {
      const top = ground(c);
      for (let k = 0; top + k * S < h; k++) {
        const y = top + k * S;
        if (k === 0) {
          block(c * S, y, DIRT);
          g.fillStyle = GRASS[0];
          g.fillRect(c * S, y, S, S * 0.3);
          g.fillStyle = GRASS[2];
          for (let i = 0; i < 4; i++) if (rnd() > 0.5) g.fillRect(c * S + (i * S) / 4, y + S * 0.3, S / 4, S / 8);
        } else block(c * S, y, k < 3 ? DIRT : STONE);
      }
    }
    // A tree: trunk and a leaf crown.
    const tc = Math.floor(cols * 0.62), ty = ground(tc);
    for (let k = 1; k <= 3; k++) block(tc * S, ty - k * S, ["#6b4a2f", "#5c3f27", "#7a5636"]);
    const LEAVES = ["#4f8a2a", "#447a24", "#5c9a31"];
    for (let dx = -2; dx <= 2; dx++) for (let dy = 4; dy <= 5; dy++) block((tc + dx) * S, ty - dy * S, LEAVES);
    for (let dx = -1; dx <= 1; dx++) block((tc + dx) * S, ty - 6 * S, LEAVES);
  },
};

/**
 * Paints a project's artwork on a canvas at its CSS size (or a given size).
 * With `withTitle`, the project name and kind are drawn on top, so the canvas
 * can serve as a WebGL texture without any HTML overlay.
 */
export function paintProject(
  canvas: HTMLCanvasElement,
  project: Project,
  seed: number,
  opts: { width?: number; height?: number; withTitle?: boolean; index?: string; live?: Live } = {},
) {
  const dpr = opts.width ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  const w = opts.width ?? canvas.clientWidth;
  const h = opts.height ?? canvas.clientHeight;
  if (!w || !h) return;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const g = canvas.getContext("2d");
  if (!g) return;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  PAINTERS[project.art](g, w, h, seeded(7 + seed * 31), { live: opts.live });
  if (!opts.withTitle) return;

  // Legibility gradient under the title, whatever the artwork's colours.
  const grad = g.createLinearGradient(0, h * 0.35, 0, h);
  grad.addColorStop(0, "rgba(31,38,48,0)");
  grad.addColorStop(1, "rgba(31,38,48,.82)");
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);
  const pad = w * 0.055;
  g.fillStyle = PALETTE.lav;
  g.font = `800 ${Math.round(h * 0.15)}px "Bricolage Grotesque Variable", "Arial Black", sans-serif`;
  g.textBaseline = "alphabetic";
  g.fillText(project.name, pad, h - pad * 1.55, w - pad * 2);
  g.font = `500 ${Math.round(h * 0.036)}px "DM Mono", monospace`;
  g.fillStyle = PALETTE.mist;
  g.fillText(`${opts.index ?? ""}  ${project.kind.toUpperCase()}`.trim(), pad, h - pad * 0.75);
}

/** Size of a carousel panel's artwork; the 1.6 ratio is the 3D panel's. */
export const PANEL_ART = { width: 1600, height: 1000 };
/** Corner radius of a panel, as a share of its height (the carousel shader's rounded mask). */
export const PANEL_RADIUS = 0.018;

/** Panels already painted, by project and text (the kind is translated): the modal copies one at every opening, painting it each time costs a frame on phones. */
const panels = new Map<string, HTMLCanvasElement>();

/** Paints a project exactly as its carousel panel shows it: artwork, title and number. */
export function paintPanel(canvas: HTMLCanvasElement, project: Project, index: number) {
  const key = `${project.slug}|${project.name}|${project.kind}`;
  let done = panels.get(key);
  if (!done) {
    // Painted into a canvas of its own: `canvas` may be repainted with another project later.
    done = document.createElement("canvas");
    paintProject(done, project, index, { ...PANEL_ART, withTitle: true, live: "panel", index: String(index + 1).padStart(2, "0") });
    panels.set(key, done);
  }
  canvas.width = done.width;
  canvas.height = done.height;
  canvas.getContext("2d")?.drawImage(done, 0, 0);
}
