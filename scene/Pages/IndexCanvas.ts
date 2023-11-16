import type { RafR, rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { WelcomeGL } from "../Components/Welcome";
import { Picker } from "../Components/Picker";
import { providerPicker } from "~/composables/useCanvas";
import { CanvasNode, CanvasPage } from "../utils/types";
import { TransformNode } from "../Components/TransformNode";
import type { Camera, OGLRenderingContext, Renderer, Transform } from "ogl";

export class IndexCanvas extends CanvasPage {

    ro: ROR
    raf: RafR
    canvasScene: any
    target: any;
    renderer: Renderer;
    camera: Camera;

    constructor(gl: OGLRenderingContext, options: { scene: Transform, camera: Camera }) {
        super(gl)

        this.node = options.scene

        // const canvasWatch = plugWatch(this)
        this.renderer = this.gl.renderer

        this.camera = options.camera


        this.onDestroy(() => {
            this.node.setParent(null);
        })

        N.BM(this, ["render", "resize", "init", "destroy"]);

        this.ro = useROR(this.resize)
        this.onDestroy(() => this.ro.off())
        this.raf = useRafR(this.render)
        this.onDestroy(() => this.raf.kill())

        this.mount()
    }
    init() {
        this.raf.run()
        this.ro.on()
    }

    mount() {


        const picker = new Picker(this.gl, {
            node: this.node,
            camera: this.camera
        })
        this.onDestroy(() => {
            picker.destroy()
        })

        const welcome = new WelcomeGL(this.gl)

        const transformNode = new TransformNode(this.gl)

        picker.add(
            this.add([
                transformNode.add(
                    welcome
                ),
                ...N.Arr.create(5).map(() => {
                    const welcome = new WelcomeGL(this.gl)
                    return welcome
                })
            ])
        )


        useDelay(1000, () => {
            transformNode.destroy()
        })
    }

    resize({ vh, vw, scale, breakpoint }: ResizeEvent) {
    }


    render(e: rafEvent) {

        this.renderer.render({
            scene: this.node,
            camera: this.camera,
        })
    }

    destroy() {
        super.destroy()
    }
}