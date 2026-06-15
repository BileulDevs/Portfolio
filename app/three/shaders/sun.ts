import { noiseGLSL } from './noise.glsl'

/** Surface solaire émissive (granulation animée). */
export const sunVertex = /* glsl */ `
varying vec3 vPos;
void main(){
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const sunFragment = /* glsl */ `
${noiseGLSL}
uniform float uTime;
varying vec3 vPos;
void main(){
  vec3 n = normalize(vPos);
  float g = fbm(n * 3.5 + vec3(0.0, 0.0, uTime * 0.15));
  g += 0.5 * fbm(n * 8.0 - vec3(uTime * 0.1));
  float t = clamp(g * 0.5 + 0.6, 0.0, 1.0);
  // gradient chaud : rouge profond → orange → blanc
  vec3 col = mix(vec3(0.7, 0.12, 0.02), vec3(1.0, 0.55, 0.15), t);
  col = mix(col, vec3(1.0, 0.95, 0.8), smoothstep(0.7, 1.0, t));
  gl_FragColor = vec4(col * 1.6, 1.0);
}
`

/** Halo / couronne additif autour du soleil. */
export const coronaVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

export const coronaFragment = /* glsl */ `
uniform vec3 uColor;
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  float fres = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 2.2);
  gl_FragColor = vec4(uColor, fres * 0.9);
}
`
