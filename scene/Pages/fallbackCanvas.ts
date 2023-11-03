import { RafR, rafEvent } from "~/plugins/core/raf"
import { ROR, ResizeEvent } from "~/plugins/core/resize"

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

export class FallbackCanvas implements CanvasPage {
  gl: any
  renderer: any
  scene: any
  camera: any

  ro: ROR
  raf: RafR
  canvasSize: { width: number; height: number }
  once: boolean
  constructor({ gl, scene, camera }: { gl: any, scene: any, camera: any }) {
    const { $RafR, $ROR } = useNuxtApp()
    this.gl = gl
    this.renderer = this.gl.renderer

    this.scene = scene
    this.camera = camera

    N.BM(this, ['render', 'resize'])

    this.ro = new $ROR(this.resize)
    const { canvasSize, unWatch}= useCanvasSize(() => {
      this.ro.trigger()
    })
    this.canvasSize  = canvasSize

    this.once = false
    this.raf = new $RafR(this.render)
  }
  async init() {
    this.raf.run()
  }

  resize({ vh, vw, scale, breakpoint }: ResizeEvent) {
  }

  render(e: rafEvent) {
    if(this.once) {
      this.raf.stop()
      return
    }
    this.renderer.render({
      camera: this.camera,
      scene: this.scene
    })
    this.once = true
  }

  destroy() {
  }
}