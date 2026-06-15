/** Champ d'étoiles GPU — taille atténuée par la distance + scintillement. */

export const starfieldVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
attribute float aScale;
attribute float aSeed;
attribute vec3 aColor;
varying vec3 vColor;
varying float vTwinkle;

void main(){
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // scintillement doux et désynchronisé
  vTwinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 30.0);
  gl_PointSize = uSize * aScale * uPixelRatio * (300.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 18.0);
  gl_Position = projectionMatrix * mvPosition;
}
`

export const starfieldFragment = /* glsl */ `
varying vec3 vColor;
varying float vTwinkle;

void main(){
  // disque doux avec halo
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float core = smoothstep(0.5, 0.0, d);
  float glow = smoothstep(0.5, 0.12, d);
  float alpha = (core * 0.85 + glow * 0.35) * vTwinkle;
  if(alpha < 0.01) discard;
  gl_FragColor = vec4(vColor * (0.8 + vTwinkle * 0.6), alpha);
}
`
