import Callstack from "./Callstack";
import { type OGLRenderingContext, type Transform } from 'ogl'
import { getUId } from "./WebGL.utils";

export class CanvasNode {
  gl: OGLRenderingContext;
  destroyStack: Callstack;
  killed: boolean = false;

  declare node: Transform;
  id: number;
  uId: [number, number, number, number];

  constructor(gl: any) {
    this.gl = gl
    const { id, uId } = getUId()
    this.id = id
    this.uId = uId

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

  add(canvasNode: CanvasNode | CanvasNode[]) {
    if (Array.isArray(canvasNode)) {
      for (const canvasN of canvasNode) {

        canvasN.node.setParent(this.node)

        this.onDestroy(() => {

          canvasN.destroy()
        })
      }
    } else {
      canvasNode.node.setParent(this.node)
      this.onDestroy(() => {
        canvasNode.destroy()
      })
    }

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