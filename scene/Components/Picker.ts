
import { Transform, Camera, RenderTarget, Program, type OGLRenderingContext } from 'ogl'

import { CanvasNode } from '../utils/types';
import { EventHandler } from '../utils/WebGL.utils';

const { mouse, vh, vw } = useStoreView()

// Drop frames with mousemove after 300 meshes
export class Picker extends CanvasNode {
    dpr: number;
    camera: Camera;

    indexPicked: null | number;

    // private clickCallstack: Callstack;
    pickerProgam: any;
    target: any;
    eventHandler: EventHandler;
    needUpdate: { click: boolean; hover: boolean; on: boolean; };
    constructor(gl: OGLRenderingContext, options: { node: Transform, camera: Camera }) {
        super(gl)
        this.camera = options.camera

        this.dpr = devicePixelRatio

        this.needUpdate = {
            click: false,
            hover: false,
            on: false
        }
        this.indexPicked = null

        N.BM(this, ['pick'])
        const click = () => {
            this.needUpdate.click = true
            this.needUpdate.on = true
        }
        const hover = () => {
            this.needUpdate.hover = true
            this.needUpdate.on = true
        }
        document.addEventListener('click', click)
        document.addEventListener('mousemove', hover)

        this.onDestroy(() => {
            document.removeEventListener('click', click)
            document.removeEventListener('mousemove', hover)
        })
        this.eventHandler = new EventHandler()
        this.onDestroy(providerPicker(this))
    }

    mount() {
        this.target = new RenderTarget(this.gl, {
            color: 2,
            width: innerWidth * devicePixelRatio,
            height: innerHeight * devicePixelRatio
        })

        const renderList = this.gl.renderer.getRenderList({
            scene: this.node,
            camera: this.camera,
            frustumCull: false,
            sort: false
        })

        for (let index = 0; index < renderList.length; index++) {
            const program = renderList[index].program
            program.uniforms.uPicking = { value: false }
        }
    }
    init() {
        const ro = useROR(({ vw, vh }) => {
            this.target.setSize(vw * devicePixelRatio, vh * devicePixelRatio)
        })
        ro.on()
        this.onDestroy(() => ro.off())

        const raf = useRafR(this.pick)
        raf.run()
        this.onDestroy(() => raf.kill())
    }

    add(canvasNode: CanvasNode) {
        this.node = canvasNode.node

        this.mount()
        this.init()
        return this
    }

    onClick(id: number, callback: (e: number) => void) {
        this.eventHandler.on("click-" + id, callback)
    }
    onHover(id: number, callback: (e: number) => void) {
        this.eventHandler.on("hover-" + id, callback)
    }

    private pick() {
        if (!this.needUpdate.on) return

        const renderList = this.gl.renderer.getRenderList({
            scene: this.node,
            camera: this.camera,
            frustumCull: false,
            sort: false
        })

        for (let index = 0; index < renderList.length; index++) {
            const program = renderList[index].program
            program.uniforms.uPicking = { value: true }
        }

        this.gl.renderer.render({
            scene: this.node,
            camera: this.camera,
            target: this.target
        });


        if (!this.gl.renderer.isWebgl2) {
            console.warn("Picking not allowed")
        }

        // Framebuffer is binded from render()
        // now read the right gl.COLOR_ATTACHMENT
        // in this pipeline, uIDs are drawn in FragColor[1]
        (this.gl as WebGL2RenderingContext).readBuffer((this.gl as WebGL2RenderingContext).COLOR_ATTACHMENT1);

        const data = new Uint8Array(4);
        this.gl.readPixels(
            mouse.x * this.dpr,
            (vh.value - mouse.y) * this.dpr,
            1,
            1,
            this.gl.RGBA,           // format
            this.gl.UNSIGNED_BYTE,  // type
            data);             // typed array to hold result

        const index = data[0] + data[1] * 256 + data[2] * 256 * 256 + data[3] * 256 * 256 * 256
        this.indexPicked = index >= 0 ? index : null

        for (let index = 0; index < renderList.length; index++) {
            const program = renderList[index].program
            program.uniforms.uPicking.value = false
        }

        this.eventHandling(index)
    }

    eventHandling(index: number) {
        if (this.needUpdate.click) this.eventHandler.emit(`click-${index}`, index)
        if (this.needUpdate.hover) this.eventHandler.emit(`hover-${index}`, index)
        this.needUpdate.click = false
        this.needUpdate.hover = false
        this.needUpdate.on = false
    }
}

const pickerFragment = /* glsl */ `#version 300 es
precision highp float;

uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor;

void main() {
  FragColor = uId;
}
`