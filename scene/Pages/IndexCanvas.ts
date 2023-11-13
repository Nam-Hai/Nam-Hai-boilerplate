import type { RafR, rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";
import Callstack from "../utils/Callstack"
import type { CanvasPage } from "../utils/types";

//@ts-ignore
import { Transform } from "ogl";
import { WelcomeGL } from "../Components/Welcome";
import { Picker } from "../Components/Picking";
import { providerPicker } from "~/composables/useCanvas";

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


        for (let i = 0; i < 5; i++) {
            const welcome = new WelcomeGL(this.gl)
            welcome.mesh.setParent(this.scene)
            this.destroyStack.add(() => welcome.destroy())
            welcome.mesh.position.set(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
            )
        }
        const group = new Transform()
        const welcome = new WelcomeGL(this.gl)
        welcome.mesh.setParent(group)
        this.destroyStack.add(() => welcome.destroy())
        welcome.mesh.position.set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
        )

        const picker = new Picker(this.gl, {
            node: this.scene,
            camera: this.camera
        })

        providerPicker(picker)
    }
    init() {
        this.raf.run()
        this.ro.on()

        // useDelay(1000, () => {
        //     const canvas = useCanvas()
        //     console.log(canvas);
        // }).run()
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