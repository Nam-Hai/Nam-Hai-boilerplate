import type { RafR, rafEvent } from "~/plugins/core/raf"
import type { ROR, ResizeEvent } from "~/plugins/core/resize"
import { CanvasPage } from "../utils/types"
import Callstack from "../utils/Callstack"

export class FallbackCanvas extends CanvasPage {
  renderer: any
  scene: any
  camera: any

  ro: ROR
  raf: RafR
  once: boolean
  constructor(gl: any, options: { scene: any, camera: any }) {
    super(gl)

    this.renderer = this.gl.renderer

    this.node = options.scene
    this.scene = options.scene
    this.camera = options.camera

    N.BM(this, ['render', 'resize'])

    this.ro = useROR(this.resize)
    this.onDestroy(() => this.ro.off())
    this.raf = useRafR(this.render)
    this.onDestroy(() => this.raf.kill())

    this.once = false
  }
  init() {
    this.raf.run()
    this.ro.on()
  }

  resize({ vh, vw, scale, breakpoint }: ResizeEvent) {
  }

  render(e: rafEvent) {
    if (this.once) {
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
    super.destroy()
  }
}