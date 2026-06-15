import { noiseGLSL } from './noise.glsl'

/**
 * Planète procédurale générique, éclairée par une direction solaire (uSunDir).
 * uType : 0 = tellurique (océans/continents), 1 = géante gazeuse (bandes), 2 = rocheuse.
 * Aucune texture externe : tout est généré par bruit.
 */

export const planetVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosL;
varying vec3 vViewDir;
void main(){
  vPosL = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

export const planetFragment = /* glsl */ `
${noiseGLSL}
uniform float uTime;
uniform int uType;
uniform vec3 uSunDir;     // direction (monde) vers le soleil
uniform vec3 uColorLow;   // océan / bandes sombres / roche sombre
uniform vec3 uColorMid;   // terres / bandes claires
uniform vec3 uColorHigh;  // sommets / glace / poussière
uniform float uSeed;
varying vec3 vNormalW;
varying vec3 vPosL;
varying vec3 vViewDir;

void main(){
  vec3 n = normalize(vPosL);
  vec3 col;
  float spec = 0.0;

  if(uType == 0){
    // --- Tellurique : continents par fbm seuillé, glace polaire ---
    float h = fbm(n * 2.4 + uSeed);
    h = h * 0.5 + 0.5;
    float land = smoothstep(0.5, 0.56, h);
    vec3 ocean = uColorLow;
    vec3 ground = mix(uColorMid, uColorHigh, smoothstep(0.56, 0.85, h));
    col = mix(ocean, ground, land);
    float ice = smoothstep(0.78, 0.95, abs(n.y));
    col = mix(col, vec3(0.92, 0.96, 1.0), ice);
    spec = (1.0 - land) * 0.5; // reflet spéculaire sur l'eau
  } else if(uType == 1){
    // --- Géante gazeuse : bandes latitudinales tourbillonnantes ---
    float bands = sin(n.y * 9.0 + fbm(n * 1.3 + vec3(uTime * 0.02, uSeed, 0.0)) * 2.2);
    float t = bands * 0.5 + 0.5;
    col = mix(uColorLow, uColorMid, t);
    col = mix(col, uColorHigh, smoothstep(0.7, 1.0, fbm(n * 3.0 + uSeed)));
  } else {
    // --- Rocheuse : poussière + cratères ---
    float h = fbm(n * 3.2 + uSeed) * 0.5 + 0.5;
    col = mix(uColorLow, uColorMid, h);
    float craters = smoothstep(0.42, 0.4, abs(fbm(n * 6.0 + uSeed * 2.0)));
    col = mix(col, uColorHigh, craters * 0.4);
  }

  // Éclairage (Lambert + terminateur doux)
  float ndl = dot(normalize(vNormalW), normalize(uSunDir));
  float day = smoothstep(-0.25, 0.35, ndl);
  vec3 lit = col * (0.22 + day * 1.05); // 0.22 = plancher d'ambiance (face nuit lisible)

  // Spéculaire (eau) côté jour
  vec3 h = normalize(normalize(uSunDir) + vViewDir);
  float s = pow(max(dot(normalize(vNormalW), h), 0.0), 60.0) * spec * day;
  lit += vec3(0.7, 0.85, 1.0) * s;

  // Rim atmosphérique froid sur le limbe éclairé
  float rim = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 3.0);
  lit += vec3(0.25, 0.5, 0.9) * rim * day * 0.6;

  gl_FragColor = vec4(lit, 1.0);
}
`

/** Coquille atmosphérique additive (légèrement plus grande que la planète). */
export const atmosphereVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

export const atmosphereFragment = /* glsl */ `
uniform vec3 uSunDir;
uniform vec3 uColor;
varying vec3 vNormalW;
varying vec3 vViewDir;
void main(){
  float fres = pow(1.0 - max(dot(vNormalW, vViewDir), 0.0), 2.6);
  float day = smoothstep(-0.3, 0.4, dot(normalize(vNormalW), normalize(uSunDir)));
  float a = fres * (0.25 + day * 0.85);
  gl_FragColor = vec4(uColor, a);
}
`
