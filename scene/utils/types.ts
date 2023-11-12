import { RafR, rafEvent } from "~/plugins/core/raf";
import { ROR, ResizeEvent } from "~/plugins/core/resize";
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

class NodeResolver {
  gl: any;
  group: Transform;
  constructor(gl: any, options: { group?: Transform } = {}) {
    this.gl = gl
    this.group = options.group || new Transform()
  }

  addNode(node: CanvasNode) {
    node.node.setParent(this.group)
    node.onDestroy(() => {
      node.node.setParent(null)
    })
    return node
  }
}


class CanvasNode {
  gl: any;
  private destroyStack: Callstack;

  node: Transform;
  nodeResolver: NodeResolver;
  constructor(gl: any) {
    this.gl = gl

    this.nodeResolver = new NodeResolver(this.gl, { group: this.node })
    this.destroyStack = new Callstack()
  }


  onDestroy(callback: () => void) {
    this.destroyStack.add(callback)
  }

  destroy() {
    this.destroyStack.call()
  }
}