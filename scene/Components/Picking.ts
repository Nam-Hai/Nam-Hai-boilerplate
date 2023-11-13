// @ts-ignore
import { Transform, Camera, RenderTarget, Program } from 'ogl'

import Callstack from "../utils/Callstack";
import { basicVer } from '../shaders/BasicVer';
import { getUId } from '../utils/WebGL.utils';

const { mouse, vh, vw } = useStoreView()

// Drop frames with mousemove after 300 meshes
export class Picker {
    private gl: any;
    dpr: number;
    node: Transform;
    camera: Camera;

    needUpdate: boolean;
    indexPicked: null | number;

    private clickCallstack: Callstack;
    pickerProgam: any;
    target: any;
    constructor(gl: any, options: { node: Transform, camera: Camera }) {
        this.gl = gl
        this.node = options.node
        this.camera = options.camera

        this.dpr = devicePixelRatio

        this.needUpdate = false
        this.indexPicked = null

        N.BM(this, ['pick'])
        document.addEventListener('click', this.pick)
        // document.addEventListener('mousemove', this.pick)

        this.target = new RenderTarget(this.gl, {
            width: innerWidth * devicePixelRatio,
            height: innerHeight * devicePixelRatio
        })
        this.clickCallstack = new Callstack()
        this.pickerProgam = new Program(this.gl, {
            vertex: basicVer,
            fragment: pickerFragment,
            uniforms: {
                uId: { value: [0, 0, 0, 0] }
            }
        })


        const renderList = this.gl.renderer.getRenderList({
            scene: this.node,
            camera: this.camera
        })

        for (let index = 0; index < renderList.length; index++) {
            const program = renderList[index].program
            program.uniforms.uPicking = { value: false }
            program.uniforms.uId = { value: getUId() }
        }
    }

    onClick(callback: () => void) {
        this.needUpdate = true
        this.clickCallstack.add(callback)
    }

    private pick() {
        const renderList = this.gl.renderer.getRenderList({
            scene: this.node,
            camera: this.camera
        })

        for (let index = 0; index < renderList.length; index++) {
            const program = renderList[index].program
            program.uniforms.uPicking.value = true
        }

        this.gl.renderer.render({
            scene: this.node,
            camera: this.camera,
            // target: this.target
        })

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