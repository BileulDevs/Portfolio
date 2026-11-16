/**
 * The only Three.js entry point of the app. Named imports let the bundler drop the rest
 * of the library (~750 kB → ~150 kB); the carousel loads this module lazily.
 */
export {
  CanvasTexture,
  LinearMipmapLinearFilter,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
export type { Texture } from "three";
