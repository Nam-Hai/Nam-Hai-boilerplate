import { basicVer } from "../shaders/BasicVer";
import Callstack from "../utils/Callstack";
import { CanvasElement } from "../utils/types";

//@ts-ignore
import { Plane, Program, Mesh } from "ogl"
import { cosinePalette } from "../shaders/color";
import { RafR } from "~/plugins/core/raf";

export class WelcomeGL implements CanvasElement {

    destroyStack: Callstack
    gl: any;
    mesh: any;
    uTime: { value: number; };
    raf: RafR;
    constructor(gl: any, options?: {}) {
        this.destroyStack = new Callstack()
        this.gl = gl

        this.uTime = { value: 0 }
        const geometry = new Plane(this.gl)
        const program = new Program(this.gl, {
            vertex: basicVer,
            fragment,
            uniforms: {
                uTime: this.uTime
            }
        })

        this.raf = useRafR(({ elapsed }) => {
            this.uTime.value = elapsed / 2000
        })
        this.destroyStack.add(() => this.raf.kill())

        this.mesh = new Mesh(this.gl, { program, geometry })
        this.init()
    }

    init() {
        this.raf.run()
    }

    destroy() {
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;

in vec2 vUv;
out vec4 FragColor;

${cosinePalette}

void main() {
    vec3 color = cosinePalette(vUv.x *(1. + 1. * sin(uTime))+ uTime, vec3(0.5, 0.5, 0.5), vec3(0.5), vec3(0.9 + 0.2 * cos(2. * uTime), 1., 0.85 + 0.15 * sin(2. * uTime)), vec3(0., 0.1, 0.2));
    FragColor = vec4(color, 1.);
}
`