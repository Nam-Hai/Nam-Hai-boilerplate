import { RafR, rafEvent } from "~/plugins/core/raf";
import { ROR, ResizeEvent } from "~/plugins/core/resize";

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

