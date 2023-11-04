import { RafR, rafEvent } from "~/plugins/core/raf"
import { ROR, ResizeEvent } from "~/plugins/core/resize"
import Callstack from "../utils/Callstack"
import { CanvasPage } from "../utils/types";

//@ts-ignore
import { Transform } from "ogl";


export class ExempleCanvas implements CanvasPage {
  gl: any
  renderer: any
  scene: any
  camera: any

  ro: ROR
  raf: RafR
  destroyStack: Callstack
  canvasScene: any

  constructor({ gl, scene, camera }: { gl: any, scene: any, camera: any }) {
    this.destroyStack = new Callstack();
    const canvasWatch = plugWatch(this)
    this.gl = gl
    this.renderer = this.gl.renderer

    this.canvasScene = scene;
    this.scene = new Transform();
    this.scene.setParent(this.canvasScene);

    this.camera = camera

    N.BM(this, ["render", "resize", "init", "destroy"]);

    this.ro = useROR(this.resize)
    this.destroyStack.add(() => this.ro.off())
    this.raf = useRafR(this.render)
    this.destroyStack.add(() => this.raf.kill())
  }
  init() {
    this.raf.run()
    this.ro.on()
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
    this.scene.setParent(null);
    this.destroyStack.call();
  }
}