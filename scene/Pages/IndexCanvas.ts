import type { RafR, rafEvent } from "~/plugins/core/raf";
import type { ROR, ResizeEvent } from "~/plugins/core/resize";

import { WelcomeGL } from "../Components/Welcome";
import { Picker } from "../Components/Picker";
import { providerPicker } from "~/composables/useCanvas";
import { CanvasNode, CanvasPage } from "../utils/types";
import { O } from "../utils/WebGL.utils";
import { TransformNode } from "../Components/TransformNode";

export class IndexCanvas extends CanvasPage {
    renderer: any
    camera: any

    ro: ROR
    raf: RafR
    canvasScene: any
    target: any;

    constructor(gl: any, options: { scene: any, camera: any }) {
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
        super.init()
        this.raf.run()
        this.ro.on()

        // useDelay(1000, () => {
        //     const canvas = useCanvas()
        //     console.log(canvas);
        // }).run()
    }

    mount() {

        console.log('mount');
        const welcome = new WelcomeGL(this.gl)
        this.add(
            welcome
        )

        for (let i = 0; i < 5; i++) {
            const welcome = new WelcomeGL(this.gl)
            this.add(welcome)
            welcome.node.position.set(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
            )
        }
        const transformNode = new TransformNode(this.gl)

        this.add(
            transformNode.add(
                welcome
            )
        )

        useDelay(1000, () => {
            transformNode.destroy()
            console.log(transformNode.node);
        })
        const picker = new Picker(this.gl, {
            node: this.node,
            camera: this.camera
        })

        // this.target = new O.RenderTarget(this.gl, {
        //     color: 2
        // })
        // console.log(this.target);
        this.onDestroy(providerPicker(picker))
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