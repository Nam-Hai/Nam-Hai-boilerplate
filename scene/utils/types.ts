import type { RafR, rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";
import Callstack from "./Callstack";

// @ts-ignore
import { Renderer, Camera, Transform } from 'ogl'
export interface CanvasPage extends CanvasElement {
  gl: any,
  scene: any,
  camera: any,
  renderer: any,

  ro: ROR,
  raf: RafR,
  destroyStack: Callstack

  init(): void
  resize({ vh, vw, scale, breakpoint }: ResizeEvent): void
  render(e: rafEvent): void
  destroy(): void
}

export interface CanvasElement {
  destroyStack: Callstack
  init(): void

  destroy(): void
}

export class CanvasNode {
  gl: any;
  private destroyStack: Callstack;

  node: Transform;
  parentNode: Transform;
  // nodeResolver: NodeResolver;
  constructor(gl: any) {
    this.gl = gl

    // this.nodeResolver = new NodeResolver(this.gl, { group: this.node })
    this.destroyStack = new Callstack()

    this.mount()
    this.init()
  }

  mount() {
    // place where you add new CanvasNode
    // this.add(
    //   new Welcome(this.gl)
    // )

  }
  private init() {
    this.node.setParent(this.node)
    this.onDestroy(() => {
      this.node.setParent(null)
    })
  }

  add(canvasNode: CanvasNode) {
    // besoin du node parent pour les PostProcesseur/Picker/etc
    canvasNode.parentNode = this.node
  }

  onDestroy(callback: () => void) {
    this.destroyStack.add(callback)
  }

  destroy() {
    this.destroyStack.call()
  }
}