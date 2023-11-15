
import { Geometry, Program, Mesh } from 'ogl'
import { basicFrag } from '../shaders/BasicFrag.js'
import { basicVer } from '../shaders/BasicVer.js'

export default class Line {
    mesh: any
    gl: any
    position: { x: number; y: number }
    line: any
    uColor: { value: number[] }
    constructor(gl: any, { color }: { color: [number, number, number, number] } = { color: [0, 0, 0, 1.] }) {
        this.gl = gl
        this.uColor = { value: color }
        this.position = reactive({
            x: 0,
            y: 0
        })
        this.mesh = this.createLine()
        this.placeLine()
        this.init()
    }
    init() {
    }
    createLine() {
        const geometry = new Geometry(this.gl, {
            position: { size: 3, data: new Float32Array([0, 0, 0, 0, 1, 0]) },
            uv: { size: 2, data: new Float32Array([0, 0, 1, 1]) },
            index: { data: new Uint16Array([0, 1]) }
        })


        const program = new Program(this.gl, {
            vertex: basicVer,
            fragment,
            uniforms: {
                uColor: this.uColor
            }
        })
        const line = new Mesh(this.gl, {
            mode: this.gl.LINES,
            geometry,
            program
        })
        line.scale.y = 0
        return line
    }

    placeLine() {
    }

    destroy() {
        this.mesh.setParent(null)
        this.mesh = null
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform vec4 uColor;

in vec2 vUv;
out vec4 FragColor;

void main() {
  FragColor = uColor;
}
`

