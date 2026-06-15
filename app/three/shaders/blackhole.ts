import { noiseGLSL } from './noise.glsl'

/**
 * Disque d'accrétion : gradient de température (intérieur chaud → extérieur froid),
 * turbulence en rotation, et asymétrie de luminosité (approximation Doppler).
 * Posé à plat (plan XZ) ; le maillage est un disque (RingGeometry).
 */
export const diskVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vPos;
void main(){
  vUv = uv;
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const diskFragment = /* glsl */ `
${noiseGLSL}
uniform float uTime;
uniform float uInner;
uniform float uOuter;
uniform vec2 uDopplerDir; // direction (plan local XY) du côté qui s'approche → plus brillant
varying vec2 vUv;
varying vec3 vPos;

void main(){
  // RingGeometry est dans le plan XY en coordonnées locales
  float r = length(vPos.xy);
  if(r < uInner || r > uOuter) discard;

  float radial = (r - uInner) / (uOuter - uInner); // 0 = bord interne
  float angle = atan(vPos.y, vPos.x);

  // turbulence en rotation différentielle (l'intérieur tourne plus vite)
  float swirl = fbm(vec3(cos(angle) * 3.0, sin(angle) * 3.0, r * 0.25 - uTime * (1.6 - radial)));
  float gas = smoothstep(0.2, 0.9, swirl * 0.5 + 0.6);

  // température : blanc-bleu chaud à l'intérieur → orange → rouge à l'extérieur
  vec3 hot = vec3(0.85, 0.92, 1.0);
  vec3 mid = vec3(1.0, 0.6, 0.2);
  vec3 cold = vec3(0.7, 0.13, 0.04);
  vec3 col = mix(hot, mid, smoothstep(0.0, 0.45, radial));
  col = mix(col, cold, smoothstep(0.45, 1.0, radial));

  // asymétrie Doppler : un côté nettement plus lumineux
  vec2 dir = normalize(vPos.xy);
  float doppler = 0.55 + 0.75 * max(dot(dir, normalize(uDopplerDir)), 0.0);

  float alpha = gas * smoothstep(1.0, 0.7, radial) * smoothstep(0.0, 0.08, radial);
  float bright = (1.4 - radial) * doppler;

  gl_FragColor = vec4(col * bright, alpha);
}
`

/** Anneau de photons : fin liseré incandescent autour de l'horizon. */
export const photonRingVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

export const photonRingFragment = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  float fres = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 3.5);
  vec3 col = mix(vec3(1.0, 0.7, 0.35), vec3(1.0, 0.95, 0.85), fres);
  gl_FragColor = vec4(col, fres * 1.2);
}
`
