/**
 * The only Three.js entry point of the app. Named imports let the bundler drop the rest
 * of the library (~750 kB → ~150 kB); the carousel loads this module lazily.
 */
export {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  NoColorSpace,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  Vector2,
  WebGLRenderer,
} from "three";
export type { Material, Object3D } from "three";
