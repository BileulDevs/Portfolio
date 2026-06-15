/** Galaxie spirale — points GPU colorés (cœur chaud → bras froids). */
export const galaxyVertex = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
attribute float aScale;
varying vec3 vColor;
void main(){
  vColor = color;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * aScale * uPixelRatio * (250.0 / -mv.z);
  gl_PointSize = clamp(gl_PointSize, 0.5, 10.0);
  gl_Position = projectionMatrix * mv;
}
`

export const galaxyFragment = /* glsl */ `
varying vec3 vColor;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  if(a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}
`
