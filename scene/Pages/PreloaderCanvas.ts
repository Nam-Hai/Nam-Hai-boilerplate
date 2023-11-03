import { RafR, rafEvent } from "~/plugins/core/raf";
import Callstack from "../utils/Callstack";
import { ROR, ResizeEvent } from "~/plugins/core/resize";
import { CanvasPage } from "./fallbackCanvas";

//@ts-ignore
import { Transform } from "ogl";

const { vh, vw, scale } = useStore();

export default class PreloaderCanvas implements CanvasPage {
  gl: any;
  renderer: any;
  scene: any;
  camera: any;

  ro: ROR;
  raf!: RafR;
  canvasSize: { width: number; height: number };
  callStack: Callstack;

  canvasScene: any;

  constructor({ gl, scene, camera }: { gl: any; scene: any; camera: any }) {
    this.gl = gl;
    this.renderer = this.gl.renderer;

    this.canvasScene = scene;
    this.scene = new Transform();
    this.scene.setParent(this.canvasScene);
    this.camera = camera;

    N.BM(this, ["render", "resize", "init"]);

    this.raf = useRafR(this.render);
    this.ro = useROR(this.resize);
    const { canvasSize, unWatch } = useCanvasSize(() => {
      this.ro.trigger();
    });
    this.canvasSize = canvasSize;


    this.callStack = new Callstack([
      () => unWatch(),
      () => this.raf.stop(),
      () => this.ro.off(),
    ]);
  }
  init() {
    this.raf.run();

    this.preloaderAnimation();
  }

  preloaderAnimation() {
    // DEBUG, skip preloader animation
    useStore().preloaderComplete.value = true
    this.destroy()
  }

  resize({ vh, vw, scale, breakpoint }: ResizeEvent) { }

  render(e: rafEvent) {
    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
      frustumCull: false,
    });
  }

  destroy() {
    this.scene.setParent(null);
    this.callStack.call();
  }
}
