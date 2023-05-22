import { RafR, rafEvent } from "~/plugins/core/raf"
import { ROR, ResizeEvent } from "~/plugins/core/resize"
import Callstack from "../utils/Callstack";
import { useRafR, useROR } from "~/composables/pluginComposables";
import BasicMaterial from "../lib/BasicMaterial";
// @ts-ignore
import { Mesh, Sphere } from 'ogl'
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

    const { mouse, vh, vw } = useStore()


    // let msdfMesh = new MSDFMesh(this.gl, {
    //   font: 'fonts/Humane.png',
    //   fontJsonUrl: 'fonts/Humane-SemiBold.json',
    //   text: 'test',
    //   color: '#ffffff'
    // })
    // msdfMesh.scene.setParent(this.scene)

    this.program = new ToonMaterial(this.gl, {
      palette: [
        {
          x: 0.,
          hex: '#003853'
        },
        {
          x: 0.4,
          hex: '#004053'
        },
        {
          x: 0.9,
          hex: '#006053'
        },
      ],
      lightPosition: [-5, 1, 1]
    })
    let mesh = new Mesh(this.gl, {
      geometry: new Sphere(this.gl, {
        widthSegments: 40
      }),
      program: this.program
    })
    let mesh2 = new Mesh(this.gl, {
      geometry: new Sphere(this.gl, {
        widthSegments: 40
      }),
      program: this.program
    })
    mesh2.position.x = -1.2

    let mesh3 = new Mesh(this.gl, {
      geometry: new Sphere(this.gl, {
        widthSegments: 40
      }),
      program: this.program
    })
    mesh3.position.set(-2, -0.4, 1.9)

    mesh.setParent(this.scene)
    mesh2.setParent(this.scene)
    mesh3.setParent(this.scene)

    watch(mouse, ({ x, y }) => {
      this.program.uniforms.uLightPosition.value = [this.canvasSize.width * (x / vw.value - 0.5), this.canvasSize.height * (0.5 - y / vh.value), 1]
    })

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
    // this.program.uLightPosition.value[0] = Math.sin(e.elapsed / 1000) * 10

    // this.program.uLightPosition.value[0] = Math.sin(e.elapsed / 1000) * 10
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
