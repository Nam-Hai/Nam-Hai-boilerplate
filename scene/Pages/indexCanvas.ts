import { RafR, rafEvent } from "~/plugins/core/raf"
import { ROR, ResizeEvent } from "~/plugins/core/resize"
import Callstack from "../utils/Callstack";
import { useRafR, useROR } from "~/composables/pluginComposables";
import BasicMaterial from "../lib/BasicMaterial";
// @ts-ignore
import { Mesh, Sphere, Plane, Texture } from 'ogl'
import NormalMaterial from "../lib/NormalMaterial";
import RampMap from "../lib/RampMap";
import palettes from "../utils/palettes";
import ToonMaterial from "../lib/ToonMaterial";

export interface CanvasPage {
  gl: any,
  scene: any,
  camera: any,
  renderer: any,

  ro: ROR,
  raf: RafR,
  canvasSize: { width: number; height: number; };

  init(): void
  resize({ vh, vw, scale, breakpoint }: ResizeEvent): void
  render(e: rafEvent): void
  destroy(): void
}


export default class IndexCanvas implements CanvasPage {
  gl: any
  renderer: any
  scene: any
  camera: any

  ro: ROR
  raf: RafR
  canvasSize: { width: number; height: number; };
  callStack: Callstack;
  mesh: any;
  constructor({ gl, scene, camera }: { gl: any, scene: any, camera: any }) {
    this.gl = gl
    this.renderer = this.gl.renderer

    this.scene = scene
    this.camera = camera

    N.BM(this, ['render', 'resize'])

    const palette = [
      {
        hex: '#ff0000',
        x: 0,
      },
      {
        hex: '#33594E',
        x: 0.1,
      },
      {
        hex: '#ff00ff',
        x: 0.3,
      },
      {
        hex: '#234549',
        x: 0.65,
      },
      {
        hex: '#235579',
        x: 0.78,
      },
      {
        hex: '#0000ff',
        x: 0.995,
      },
    ];

    const program = new ToonMaterial(this.gl, { palette, lightPosition: [-15, 15, 4] })
    program.addColor({
      x: 0.5,
      hex: '#ff0000'
    })

    let mesh = new Mesh(this.gl, {
      geometry: new Sphere(this.gl, { widthSegments: 40 }),
      program
    })

    let mesh2 = new Mesh(this.gl, {
      geometry: new Sphere(this.gl, { widthSegments: 40 }),
      program
    })
    mesh2.setParent(this.scene)
    mesh2.position.set(-3, 0, 0);

    mesh.setParent(this.scene)
    this.mesh = mesh

    this.raf = useRafR(this.render)
    this.ro = useROR(this.resize)
    const { canvasSize, unWatch } = useCanvasSize(() => {
      this.ro.trigger()
    })
    this.canvasSize = canvasSize

    this.callStack = new Callstack([unWatch, this.raf.stop, this.ro.off])
  }
  async init() {
    this.raf.run()
  }

  resize({ vh, vw, scale, breakpoint }: ResizeEvent) {
  }


  render(e: rafEvent) {

    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
    })
  }



  destroy() {
    this.callStack.call()
  }
}



const fragment = /* glsl */ `#version 300 es
precision highp float;

out vec4 FragColor;

void main() {
  // vec4 color = vec4(0.878,0.212,0.212, 1.);
  vec4 color = vec4(0.078,0.114,0.302, 1.);
  FragColor = color;
}
`