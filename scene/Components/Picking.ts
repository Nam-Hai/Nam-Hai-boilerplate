// @ts-ignore
import { Transform, Camera, Program } from 'ogl'

import Callstack from "../utils/Callstack";
import { basicVer } from '../shaders/BasicVer';

const { mouse } = useStore()

// Alpha Picker, click
// Drop frames with mousemove after 300 meshes
export default class Picker {
    private gl: any;
    dpr: number;
    node: Transform;
    camera: Camera;

    needUpdate: boolean;
    indexPicked: null | number;

    private clickCallstack: Callstack;
    pickerProgam: any;
    constructor(gl: any, options: { node: Transform, camera: Camera }) {
        this.gl = gl
        this.node = options.node
        this.camera = options.camera

        this.dpr = devicePixelRatio

        this.needUpdate = false
        this.indexPicked = null

        N.BM(this, ['pick'])
        document.addEventListener('click', this.pick)

        this.clickCallstack = new Callstack()
        this.pickerProgam = new Program(this.gl, {
            vertex: basicVer,
            fragment: pickerFragment,
            uniforms: {
                uId: { value: [0, 0, 0, 0] }
            }
        })
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
            camera: this.camera
        })

        const data = new Uint8Array(4);
        this.gl.readPixels(
            mouse.x * this.dpr,
            mouse.y * this.dpr,
            1,
            1,
            this.gl.RGBA,           // format
            this.gl.UNSIGNED_BYTE,  // type
            data);             // typed array to hold result

        const index = data[0] + data[1] * 256 + data[2] * 256 * 256
        this.indexPicked = index >= 0 ? index : null

        this.needUpdate = false

        console.log({ id: index });
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