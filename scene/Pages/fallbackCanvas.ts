import { RafR, rafEvent } from "~/plugins/core/raf"
import { ROR, ResizeEvent } from "~/plugins/core/resize"
import { CanvasPage } from "../utils/types"
import Callstack from "../utils/Callstack"

export class FallbackCanvas implements CanvasPage {
  gl: any
  renderer: any
  scene: any
  camera: any

  ro: ROR
  raf: RafR
  once: boolean
  destroyStack: Callstack
  constructor({ gl, scene, camera }: { gl: any, scene: any, camera: any }) {
    this.destroyStack = new Callstack();
    this.gl = gl
    this.renderer = this.gl.renderer

    this.scene = scene
    this.camera = camera

    N.BM(this, ['render', 'resize'])

    this.ro = useROR(this.resize)
    this.destroyStack.add(() => this.ro.off())
    this.raf = useRafR(this.render)
    this.destroyStack.add(() => this.raf.kill())

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
    this.destroyStack.call()
  }
}