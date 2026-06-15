import { noiseGLSL } from './noise.glsl'

/** Trou de ver : tunnel (TubeGeometry) avec stries d'énergie défilantes. */
export const wormholeVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const wormholeFragment = /* glsl */ `
${noiseGLSL}
uniform float uTime;
uniform float uWarp; // 0..1 intensité
varying vec2 vUv;

void main(){
  // uv.x = autour du tube, uv.y = le long du tube
  float flow = vUv.y * 6.0 - uTime * (1.5 + uWarp * 4.0);
  float streaks = fbm(vec3(vUv.x * 8.0, flow, 0.0));
  streaks = pow(streaks * 0.5 + 0.5, 2.0);

  // teinte froide → chaude vers le cœur du tunnel
  vec3 cold = vec3(0.2, 0.5, 1.0);
  vec3 warm = vec3(1.0, 0.6, 0.3);
  vec3 col = mix(cold, warm, streaks);

  float ring = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
  float a = streaks * (0.35 + uWarp * 0.65) * ring;
  gl_FragColor = vec4(col * (1.0 + uWarp), a);
}
`
