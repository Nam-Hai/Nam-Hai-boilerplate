
import type { rafEvent } from '~/plugins/core/raf';
import type { ROR, ResizeEvent } from '~/plugins/core/resize';
import { Program, Mesh, RenderTarget, Triangle } from 'ogl'
import Callstack from './utils/Callstack';

type PostProcessorOptions = {
  width: number,
  height: number,
  dpr: number,
  wrapS: any,
  wrapT: any,
  minFilter: any,
  magFilter: any,
  geometry: any,
  camera: any,
  targetOnly: any
}

type PassOptions = {
  vertex: any,
  fragment: any,
  textureUniform: string,
  uniforms: any,
  enabled: boolean,
  beforePass: (e: rafEvent, { scene, texture, camera }: { scene: any, texture: any, camera: any }) => void
}

type PassObject = {
  program: any,
  mesh: any,
  textureUniform: string,
  uniforms: any,
  enabled: boolean,
  beforePass?: (e: rafEvent, { scene, texture, camera }: { scene: any, texture: any, camera: any }) => void
}
export interface PassEffect {
  render: () => void,
  addPassRef: (addPass: (pass: Partial<PassOptions>) => PassObject) => void,
  toggleEffect: () => void,
}

type PostRenderOptions = {
  scene: any,
  camera: any,
  texture: any,
  target: any,
  update: boolean,
  sort: boolean,
  frustumCull: boolean,
  beforePostCallbacks: (() => void)[]
}
export default class PostProcessor {
  gl: any;
  camera: any;
  sizePlaneCamera: { width: number; height: number; };
  options: { width: number; height: number; wrapS: any; wrapT: any; minFilter: any; magFilter: any; };
  geometry: any;
  uniform: { value: null; };
  targetOnly: any;
  fbo: { read: any; write: any; swap: () => void; };
  dpr: number | undefined;
  ro: ROR
  width: any;
  height: any;
  passes: PassObject[];
  destroyStack: Callstack;
  constructor(
    gl: any,
    {
      width = innerWidth,
      height = innerHeight,
      dpr,
      wrapS = gl.CLAMP_TO_EDGE,
      wrapT = gl.CLAMP_TO_EDGE,
      minFilter = gl.LINEAR,
      magFilter = gl.LINEAR,
      geometry = new Triangle(gl),
      camera,
      targetOnly = null,
    }: Partial<PostProcessorOptions>
  ) {
    this.gl = gl;

    this.camera = camera
    if (this.camera) {
      this.camera.position.z = 5;
    }

    this.passes = [];

    const { size: canvasSize } = useCanvas()
    this.sizePlaneCamera = canvasSize.value

    this.options = { width, height, wrapS, wrapT, minFilter, magFilter };


    this.geometry = geometry;

    this.uniform = { value: null };
    this.targetOnly = targetOnly;

    const fbo = (this.fbo = {
      read: new RenderTarget(this.gl, this.options),
      write: new RenderTarget(this.gl, this.options),
      swap: () => {
        let temp = fbo.read;
        fbo.read = fbo.write;
        fbo.write = temp;
      },
    });

    this.dpr = dpr

    this.ro = useROR(this.resize.bind(this))
    this.destroyStack = new Callstack([() => this.ro.off()])
    this.init()
  }
  init() {
    this.ro.on()

  }

  addPass({ vertex = this.camera ? cameraVertex : defaultVertex, fragment = defaultFragment, uniforms = {}, textureUniform = 'tMap', enabled = true, beforePass }: Partial<PassOptions>): PassObject {
    uniforms[textureUniform] = { value: this.fbo.read.texture };

    const program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms
    });
    const mesh = new Mesh(this.gl, { geometry: this.geometry, program });
    mesh.scale.set(this.sizePlaneCamera.width, this.sizePlaneCamera.height, 1)

    const pass = {
      mesh,
      program,
      uniforms,
      enabled,
      textureUniform,
      beforePass
    };


    this.passes.push(pass);
    return pass;
  }

  addPassEffect(passEffect: PassEffect) {
    return passEffect.addPassRef(this.addPass.bind(this))
  }

  resize({ vw, vh, scale }: ResizeEvent) {
    const { size: canvasSize } = useCanvas()
    this.sizePlaneCamera = canvasSize.value
    for (const pass of this.passes) {
      pass.mesh.scale.set(canvasSize.value.width, canvasSize.value.height, 1)
    }

    this.width = vw
    this.height = vh


    const dpr = this.dpr || this.gl.renderer.dpr;
    let scaledWidth = Math.floor((this.width || this.gl.renderer.width) * dpr);
    let scaledHeight = Math.floor((this.height || this.gl.renderer.height) * dpr);

    this.fbo.read.setSize(scaledWidth, scaledHeight)
    this.fbo.write.setSize(scaledWidth, scaledHeight)


    if (!this.camera) return
    this.camera.perspective({
      aspect: vw / vh
    });
  }

  // Uses same arguments as renderer.render, with addition of optional texture passed in to avoid scene render
  render(e: rafEvent, { scene, camera, texture, target = null, update = true, sort = true, frustumCull = true, beforePostCallbacks }: Partial<PostRenderOptions>) {
    const enabledPasses = this.passes.filter((pass) => pass.enabled);

    if (!texture) {
      this.gl.renderer.render({
        scene,
        camera,
        target: enabledPasses.length || (!target && this.targetOnly) ? this.fbo.write : target,
        update,
        sort,
        frustumCull,
      });
      this.fbo.swap();

      // Callback after rendering scene, but before post effects
      if (beforePostCallbacks) beforePostCallbacks.forEach((f) => f && f());
    }

    enabledPasses.forEach((pass, i) => {
      pass.mesh.program.uniforms[pass.textureUniform].value = !i && texture ? texture : this.fbo.read.texture;
      pass.beforePass && pass.beforePass(e, { scene, camera, texture: !i && texture ? texture : this.fbo.read.texture })
      this.gl.renderer.render({
        scene: pass.mesh,
        camera: this.camera,
        target: i === enabledPasses.length - 1 && (target || !this.targetOnly) ? target : this.fbo.write,
        clear: true,
      });
      this.fbo.swap();
    });

    this.uniform.value = this.fbo.read.texture;
  }

  destroy() {
    this.destroyStack.call()
    // this.ro.off()
  }
}

const cameraVertex = /* glsl */ `#version 300 es
    in vec2 uv;
    in vec3 position;
    out vec2 vUv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
`;
const defaultVertex = /* glsl */ `#version 300 es
    in vec2 uv;
    in vec2 position;
    out vec2 vUv;


    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;

const defaultFragment = /* glsl */ `#version 300 es
    precision highp float;
    uniform sampler2D tMap;
    in vec2 vUv;
    out vec4 glColor;
    void main() {
        glColor = texture(tMap, vUv);
        // glColor = vec4(1., 0.,0., 1.);
    }
`;

