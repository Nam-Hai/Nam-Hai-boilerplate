
import { Transform, Camera, RenderTarget, Program, type OGLRenderingContext } from 'ogl'

import { CanvasNode } from '../utils/types';
import { EventHandler } from '../utils/WebGL.utils';

const { mouse, vh, vw } = useStoreView()

// Drop frames with mousemove after 300 meshes
export class Picker extends CanvasNode {
    dpr: number;
    camera: Camera;

    indexPicked: number;

    // private clickCallstack: Callstack;
    pickerProgam: any;
    target: any;
    needUpdate: { click: boolean; hover: number; on: boolean; };
    renderTargetRatio: number;
    hoverHandler: EventHandler;
    clickHandler: EventHandler;
    constructor(gl: OGLRenderingContext, options: { node: Transform, camera: Camera, renderTargetRatio?: number }) {
        super(gl)
        this.camera = options.camera

        this.dpr = devicePixelRatio
        this.renderTargetRatio = options.renderTargetRatio || 4

        this.needUpdate = {
            click: false,
            hover: -1,
            on: false
        }
        this.indexPicked = -1

        N.BM(this, ['pick'])
        const click = () => {
            this.needUpdate.click = true
            this.needUpdate.on = true
        }
        const hover = () => {
            // this.needUpdate.hover = true
            this.needUpdate.on = true
        }
        document.addEventListener('click', click)
        // document.addEventListener('mousemove', hover)

        this.onDestroy(() => {
            document.removeEventListener('click', click)
            // document.removeEventListener('mousemove', hover)
        })
        // this.eventHandler = new EventHandler()
        this.clickHandler = new EventHandler()
        this.hoverHandler = new EventHandler()
        this.onDestroy(providerPicker(this))
    }

    mount() {
        this.target = new RenderTarget(this.gl, {
            color: 2,
            width: innerWidth * devicePixelRatio / this.renderTargetRatio,
            height: innerHeight * devicePixelRatio / this.renderTargetRatio
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
            this.target.setSize(vw * devicePixelRatio / this.renderTargetRatio, vh * devicePixelRatio / this.renderTargetRatio)
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
        this.clickHandler.on(id, callback)
    }
    useHover(id: number) {
        const hover = ref(false)
        this.hoverHandler.on(id, (e: { state: boolean }) => {
            hover.value = e.state
        })
        return hover
    }

    private pick() {
        // if (!this.needUpdate.on) return

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
            mouse.x * this.dpr / this.renderTargetRatio,
            (vh.value - mouse.y) * this.dpr / this.renderTargetRatio,
            1,
            1,
            this.gl.RGBA,           // format
            this.gl.UNSIGNED_BYTE,  // type
            data);             // typed array to hold result

        // const index = data[0] + data[1] * 256 + data[2] * 256 * 256 + data[3] * 256 * 256 * 256
        const index = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);

        for (let index = 0; index < renderList.length; index++) {
            const program = renderList[index].program
            program.uniforms.uPicking.value = false
        }

        this.eventHandling(index)
    }

    eventHandling(index: number) {
        if (this.needUpdate.click) this.clickHandler.emit(index, index)

        if (this.needUpdate.hover != this.indexPicked) {
            this.hoverHandler.emit(this.needUpdate.hover, { state: false })
            this.hoverHandler.emit(this.needUpdate.hover, { state: false })
            this.hoverHandler.emit(index, { state: true })
            this.needUpdate.hover = this.indexPicked
        }

        this.indexPicked = index >= 0 ? index : -1
        this.needUpdate.click = false
        // this.needUpdate.hover = false
        // this.needUpdate.on = false
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