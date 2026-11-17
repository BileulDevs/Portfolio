/**
 * The curved-carousel look, shared by the projects carousel (home) and the feature carousel
 * (case studies): panels bent onto a cylinder whose radius shrinks with speed, rounded corners,
 * RGB split while moving, darker toward the edges.
 */

/** Places a flat panel on a cylinder of radius `uR`, `uX` world units from the centre. */
export const CURVE_VERT = /* glsl */ `
  uniform float uX;
  uniform float uR;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    float x = position.x + uX;
    float th = x / uR;
    vec3 p = vec3(uR * sin(th), position.y, uR * cos(th) - uR);
    vFacing = cos(th);
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  }`;

/** GLSL: 1 inside a 1.6:1 panel with rounded corners, 0 outside (anti-aliased edge). */
export const ROUNDED_MASK = /* glsl */ `
  float roundedMask(vec2 uv) {
    vec2 q = abs(uv - 0.5) * vec2(1.6, 1.0) - vec2(0.8, 0.5) + 0.018;
    return 1.0 - smoothstep(0.0, 0.004, length(max(q, 0.0)) - 0.018);
  }`;

/** Cylinder radius for a given scroll velocity: tighter while moving, never folding onto itself. */
export const curveRadius = (velocity: number, rest = 10, perSpeed = 32, min = 5.5) =>
  Math.max(min, rest - Math.abs(velocity) * perSpeed);
