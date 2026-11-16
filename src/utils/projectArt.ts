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

const PAINTERS: Record<ArtStyle, (g: CanvasRenderingContext2D, w: number, h: number, rnd: () => number) => void> = {
  // Noxtys: concentric rings around a coral core, night sky dust.
  rings(g, w, h, rnd) {
    g.fillStyle = PALETTE.deep;
    g.fillRect(0, 0, w, h);
    for (let k = 0; k < 220; k++) {
      g.fillStyle = `rgba(238,237,255,${rnd() * 0.7})`;
      g.fillRect(rnd() * w, rnd() * h, 1.6, 1.6);
    }
    const cx = w * 0.68, cy = h * 0.52;
    for (let k = 16; k > 0; k--) {
      g.beginPath();
      g.arc(cx, cy, k * h * 0.05, 0, Math.PI * 2);
      g.strokeStyle = k === 5 ? PALETTE.coral : `rgba(182,205,232,${0.06 + k * 0.012})`;
      g.lineWidth = k === 5 ? h * 0.006 : 1.5;
      g.stroke();
    }
    g.fillStyle = PALETTE.coral;
    g.beginPath();
    g.arc(cx, cy, h * 0.022, 0, Math.PI * 2);
    g.fill();
  },
  // SpotR: services as city blocks, a route crossing them.
  grid(g, w, h, rnd) {
    g.fillStyle = PALETTE.slate;
    g.fillRect(0, 0, w, h);
    const cols = 10, rows = 6, cw = w / cols, ch = h / rows, m = Math.max(4, w * 0.005);
    for (let x = 0; x < cols; x++)
      for (let y = 0; y < rows; y++) {
        const r = rnd();
        g.fillStyle = r > 0.9 ? PALETTE.coral : r > 0.55 ? PALETTE.base : r > 0.35 ? PALETTE.mist : PALETTE.slate;
        g.fillRect(x * cw + m, y * ch + m, cw - 2 * m, ch - 2 * m);
      }
    g.strokeStyle = PALETTE.lav;
    g.lineWidth = Math.max(2, w * 0.003);
    g.beginPath();
    g.moveTo(0, h * 0.7);
    for (let x = 0; x <= w + cw; x += cw) g.lineTo(x, h * (0.3 + rnd() * 0.5));
    g.stroke();
  },
  // Minecraft: voxel terrain.
  voxels(g, w, h, rnd) {
    g.fillStyle = PALETTE.lav;
    g.fillRect(0, 0, w, h);
    const sz = Math.max(12, w / 34);
    let y0 = h * 0.55;
    for (let x = 0; x < w; x += sz) {
      y0 += (rnd() - 0.5) * sz * 1.2;
      y0 = Math.min(h * 0.75, Math.max(h * 0.35, y0));
      for (let y = y0; y < h; y += sz) {
        g.fillStyle = y === y0 ? PALETTE.coral : y < y0 + sz * 3 ? PALETTE.slate : PALETTE.base;
        g.fillRect(x, y, sz - 1, sz - 1);
      }
    }
  },
  // Athlon: uptime bars and a heartbeat line, like a monitoring wall.
  monitor(g, w, h, rnd) {
    g.fillStyle = PALETTE.base;
    g.fillRect(0, 0, w, h);
    const rows = 7, cols = 48, bw = w / cols, rh = h / (rows + 3);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const v = rnd();
        g.fillStyle = v > 0.985 ? PALETTE.coral : v > 0.5 ? PALETTE.mist : "rgba(182,205,232,.55)";
        g.fillRect(c * bw + 2, rh * (r + 0.6), bw - 4, rh * 0.55);
      }
    g.strokeStyle = PALETTE.coral;
    g.lineWidth = Math.max(2, w * 0.003);
    g.beginPath();
    const base = h * 0.88;
    for (let x = 0; x <= w; x += w / 60) {
      const spike = Math.abs(x - w * 0.62) < w / 50 ? -h * 0.14 : (rnd() - 0.5) * h * 0.02;
      g.lineTo(x, base + spike);
    }
    g.stroke();
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
  opts: { width?: number; height?: number; withTitle?: boolean; index?: string } = {},
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
  PAINTERS[project.art](g, w, h, seeded(7 + seed * 31));
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
