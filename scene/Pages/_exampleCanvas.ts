import { RafR, rafEvent } from "~/plugins/core/raf"
import { ROR, ResizeEvent } from "~/plugins/core/resize"
import { CanvasPage } from "./fallbackCanvas"

export default class ExampleCanvas implements CanvasPage {
  gl: any
  renderer: any
  scene: any
  camera: any

  ro: ROR
  raf: RafR
  canvasSize: { width: number; height: number }
  constructor({ gl, scene, camera }: { gl: any, scene: any, camera: any }) {
    const { $RafR, $ROR } = useNuxtApp()
    this.gl = gl
    this.renderer = this.gl.renderer

    this.scene = scene
    this.camera = camera

    N.BM(this, ['render', 'resize'])

    this.ro = new $ROR(this.resize)
    const {canvasSize, unWatch}= useCanvasSize(() => {
      this.ro.trigger()
    })
    this.canvasSize = canvasSize

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