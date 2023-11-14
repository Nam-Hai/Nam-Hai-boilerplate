import type { RafR, rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";
import Callstack from "./Callstack";

// @ts-ignore
import { type Transform } from 'ogl'

export class CanvasNode {
  gl: any;
  destroyStack: Callstack;
  killed: boolean = false;

  declare node: Transform;

  constructor(gl: any) {
    this.gl = gl

    N.BM(this, ["mount"])
    this.destroyStack = new Callstack()

  }

  mount() {
    // place where you add new CanvasNode
    // this.add(
    //   new Welcome(this.gl)
    // )

  }
  init() {
  }

  add(canvasNode: CanvasNode) {
    // besoin du node parent pour les PostProcesseur/Picker/etc
    canvasNode.node.setParent(this.node)

    this.onDestroy(() => {

      canvasNode.destroy()
    })

    return this
  }

  onDestroy(callback: () => void) {
    this.destroyStack.add(callback)
  }

  destroy() {
    if (this.killed) return
    this.killed = true
    this.node.setParent(null)
    this.destroyStack.call()
  }
}

export class CanvasPage extends CanvasNode { }