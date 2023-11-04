import { RafR, rafEvent } from "~/plugins/core/raf";
import { ROR, ResizeEvent } from "~/plugins/core/resize";
import Callstack from "./Callstack";

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
