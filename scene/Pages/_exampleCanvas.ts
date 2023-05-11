import { RafR, rafEvent } from "~/plugins/core/raf"
import { ROR, ResizeEvent } from "~/plugins/core/resize"
import { N } from "~/plugins/namhai.client"

export interface CanvasPage {
  gl: any,
  scene: any,
  camera: any,
  renderer: any,

  ro: ROR,
  raf: RafR,
  canvasSize: Ref<{ height: number; width: number }>,

  init(): void
  resize({ vh, vw, scale, breakpoint }: ResizeEvent): void
  render(e: rafEvent): void
  destroy(): void
}


export default class ExampleCanvas implements CanvasPage {
  gl: any
  renderer: any
  scene: any
  camera: any

  canvasSize: globalThis.Ref<{ height: number; width: number }>
  ro: ROR
  raf: RafR
  constructor({ gl, scene, camera }: { gl: any, scene: any, camera: any }) {
    const { $RafR, $ROR } = useNuxtApp()
    this.gl = gl
    this.renderer = this.gl.renderer

    this.scene = scene
    this.camera = camera

    N.BM(this, ['render', 'resize'])

    this.ro = new $ROR(this.resize)
    this.canvasSize = useCanvasSize(() => {
      this.ro.trigger()
    })
    this.ro.trigger()

    this.raf = new $RafR(this.render)
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
    this.raf.stop()
  }
}