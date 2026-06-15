import { noiseGLSL } from './noise.glsl'

/** Nébuleuse « faux-volumétrique » : plans additifs orientés caméra. */
export const nebulaVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const nebulaFragment = /* glsl */ `
${noiseGLSL}
uniform float uTime;
uniform float uSeed;
uniform vec3 uColorA; // cœur chaud
uniform vec3 uColorB; // violet profond
uniform vec3 uColorC; // accents cyan
uniform float uOpacity;
varying vec2 vUv;

void main(){
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  if(r > 1.0) discard;

  // warp du domaine pour des volutes organiques
  vec3 q = vec3(p * 2.2, uSeed);
  float warp = fbm(q + vec3(uTime * 0.03, uTime * 0.02, 0.0));
  float density = fbm(q * 1.6 + warp * 1.5 + vec3(0.0, 0.0, uTime * 0.04));
  density = density * 0.5 + 0.5;

  // tonalité : violet profond → cyan → cœur chaud
  vec3 col = mix(uColorB, uColorC, smoothstep(0.4, 0.7, density));
  col = mix(col, uColorA, smoothstep(0.7, 1.0, density) * (1.0 - r));

  // atténuation radiale douce (bord du plan invisible)
  float edge = smoothstep(1.0, 0.2, r);
  float a = density * edge * uOpacity;
  a *= smoothstep(0.45, 0.75, density); // garde les zones denses

  gl_FragColor = vec4(col, a);
}
`
