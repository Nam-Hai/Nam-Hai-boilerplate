import { RafR, rafEvent } from "~/plugins/core/raf"
import { ROR, ResizeEvent } from "~/plugins/core/resize"
import Callstack from "../utils/Callstack"
import { CanvasPage } from "../utils/types";

//@ts-ignore
import { Transform } from "ogl";
import { WelcomeGL } from "../Components/Welcome";
import Picker from "../Components/Picking";

export class IndexCanvas implements CanvasPage {
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

        for (let i = 0; i < 300; i++) {
            const welcome = new WelcomeGL(this.gl)
            welcome.mesh.setParent(this.scene)
            this.destroyStack.add(() => welcome.destroy())
            welcome.mesh.position.set(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
            )
        }

        const picker = new Picker(this.gl, {
            node: this.scene,
            camera: this.camera
        })
    }
    init() {
        this.raf.run()
        this.ro.on()

        // useDelay(4000, this.destroy)
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