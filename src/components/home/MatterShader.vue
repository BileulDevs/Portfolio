<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useInView } from "@/composables/useInView";
import { prefersReducedMotion } from "@/composables/useMedia";

/**
 * Hero background: domain-warped fbm noise in the palette, bent locally by the pointer.
 * Raw WebGL1, no library. Renders at half resolution and stops when off-screen.
 */
const canvas = ref<HTMLCanvasElement | null>(null);
const failed = ref(false);
const inView = useInView(canvas);

/** The field is soft, so a half-resolution buffer is visually identical and 4x cheaper to fill. */
const RESOLUTION_SCALE = 0.5;
/** Pointer smoothing per frame; higher = snappier, lower = more liquid. */
const POINTER_EASE = 0.06;
/** Fixed time used when motion is reduced: a pleasant still frame of the same field. */
const STILL_TIME = 3;

const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FRAGMENT = `precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r; vec2 p=uv; p.x*=r.x/r.y;
  vec2 mm=m; mm.x*=r.x/r.y;
  float d=length(p-mm);
  p+=(p-mm)*.35*exp(-d*d*6.);
  vec2 q=vec2(fbm(p*1.6+t*.05),fbm(p*1.6+vec2(5.2,1.3)-t*.04));
  vec2 w=vec2(fbm(p*1.4+2.*q+vec2(1.7,9.2)+t*.08),fbm(p*1.4+2.*q+vec2(8.3,2.8)));
  float f=fbm(p*1.2+2.4*w);
  vec3 base=vec3(.278,.329,.396), slate=vec3(.333,.424,.588), mist=vec3(.714,.804,.91), coral=vec3(1.,.345,.302);
  vec3 c=mix(base,slate,smoothstep(.2,.7,f));
  c=mix(c,mist,smoothstep(.62,.9,length(q))*.55);
  c=mix(c,coral,smoothstep(.58,.82,w.x*f*1.5)*.95);
  c*=.82+.25*smoothstep(1.2,.0,uv.y);
  c=mix(c,base*.82,smoothstep(.55,.0,uv.y)*smoothstep(1.1,.2,uv.x)*.75);
  gl_FragColor=vec4(c,1.);
}`;

let gl: WebGLRenderingContext | null = null;
let raf = 0;
let resizeObserver: ResizeObserver | undefined;
const pointer = { x: 0.6, y: 0.5, tx: 0.6, ty: 0.5 };
let uniforms: { r: WebGLUniformLocation | null; t: WebGLUniformLocation | null; m: WebGLUniformLocation | null };
const reduced = prefersReducedMotion();
const start = performance.now();

function compile(type: number, src: string) {
  const s = gl!.createShader(type)!;
  gl!.shaderSource(s, src);
  gl!.compileShader(s);
  if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) throw new Error(gl!.getShaderInfoLog(s) ?? "shader");
  return s;
}

function draw(now: number) {
  raf = 0;
  if (!gl || !canvas.value) return;
  pointer.x += (pointer.tx - pointer.x) * POINTER_EASE;
  pointer.y += (pointer.ty - pointer.y) * POINTER_EASE;
  gl.uniform2f(uniforms.r, canvas.value.width, canvas.value.height);
  gl.uniform1f(uniforms.t, reduced ? STILL_TIME : (now - start) / 1000);
  gl.uniform2f(uniforms.m, pointer.x, pointer.y);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  if (!reduced && inView.value) raf = requestAnimationFrame(draw);
}
const schedule = () => { if (!raf) raf = requestAnimationFrame(draw); };

function onPointer(e: PointerEvent) {
  const el = canvas.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  pointer.tx = (e.clientX - r.left) / r.width;
  pointer.ty = 1 - (e.clientY - r.top) / r.height;
  if (reduced) schedule();
}

onMounted(() => {
  const el = canvas.value!;
  gl = el.getContext("webgl", { antialias: false });
  if (!gl) { failed.value = true; return; }
  try {
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    // One oversized triangle covers the viewport: cheaper than a two-triangle quad.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    uniforms = { r: gl.getUniformLocation(prog, "r"), t: gl.getUniformLocation(prog, "t"), m: gl.getUniformLocation(prog, "m") };
  } catch (err) {
    console.info("Hero shader disabled:", (err as Error).message);
    failed.value = true;
    return;
  }
  resizeObserver = new ResizeObserver(() => {
    el.width = Math.max(1, el.clientWidth * RESOLUTION_SCALE);
    el.height = Math.max(1, el.clientHeight * RESOLUTION_SCALE);
    gl!.viewport(0, 0, el.width, el.height);
    schedule();
  });
  resizeObserver.observe(el);
  el.parentElement?.addEventListener("pointermove", onPointer);
});

watch(inView, (v) => v && schedule());

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  resizeObserver?.disconnect();
  canvas.value?.parentElement?.removeEventListener("pointermove", onPointer);
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
});
</script>

<template>
  <canvas ref="canvas" class="matter" :class="{ failed }" aria-hidden="true" />
</template>

<style scoped>
.matter { position: absolute; inset: 0; width: 100%; height: 100%; }
.failed { background: radial-gradient(circle at 70% 40%, var(--coral), transparent 40%), radial-gradient(circle at 30% 70%, var(--slate), transparent 50%), var(--base); }
</style>
