
import { Transform, Camera, RenderTarget, Program } from 'ogl'

import { CanvasNode } from '../utils/types';

const { mouse, vh, vw } = useStoreView()

// Drop frames with mousemove after 300 meshes
export class Picker extends CanvasNode {
    dpr: number;
    camera: Camera;

    needUpdate: boolean;
    indexPicked: null | number;

    // private clickCallstack: Callstack;
    pickerProgam: any;
    target: any;
    constructor(gl: any, options: { node: Transform, camera: Camera }) {
        super(gl)
        this.camera = options.camera

        this.dpr = devicePixelRatio

        this.needUpdate = false
        this.indexPicked = null

        N.BM(this, ['pick'])
        // document.addEventListener('click', this.pick)
        document.addEventListener('mousemove', this.pick)




    }
    mount() {
        this.target = new RenderTarget(this.gl, {
            color: 2,
            width: innerWidth * devicePixelRatio,
            height: innerHeight * devicePixelRatio
        })

        const renderList = this.gl.renderer.getRenderList({
            scene: this.node,
            camera: this.camera
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
    }

    add(canvasNode: CanvasNode) {
        this.node = canvasNode.node

        this.mount()
        this.init()
        return this
    }

    onClick(callback: () => void) {
        this.needUpdate = true
    }

    private pick() {
        const renderList = this.gl.renderer.getRenderList({
            scene: this.node,
            camera: this.camera
        })

        for (let index = 0; index < renderList.length; index++) {
            const program = renderList[index].program
            program.uniforms.uPicking = { value: true }
        }

        this.gl.renderer.render({
            scene: this.node,
            camera: this.camera,
            target: this.target
        })

        // Framebuffer is binded from render()
        // now read the right gl.COLOR_ATTACHMENT
        // in this pipeline, uIDs are drawn in FragColor[1]
        this.gl.readBuffer(this.gl.COLOR_ATTACHMENT1);

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
        console.log(index);
        this.indexPicked = index >= 0 ? index : null

        this.needUpdate = false

        for (let index = 0; index < renderList.length; index++) {
            const program = renderList[index].program
            program.uniforms.uPicking.value = false
        }
    }

    destroy() {
        document.removeEventListener('click', this.pick)
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