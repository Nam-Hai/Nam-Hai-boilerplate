import Callstack from "../utils/Callstack";
import { CanvasElement } from "../utils/types";

//@ts-ignore
import { Plane, Program, Mesh } from "ogl"
import { cosinePalette } from "../shaders/color";
import { RafR, rafEvent } from "~/plugins/core/raf";

export class Floor implements CanvasElement {

    destroyStack: Callstack
    gl: any;
    mesh: any;
    uTime: { value: number; };
    raf: RafR;
    constructor(gl: any, options?: {}) {
        N.BM(this, ["update"])
        this.destroyStack = new Callstack()
        this.gl = gl

        this.uTime = { value: 0 }
        const geometry = new Plane(this.gl)
        const program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: this.uTime
            }
        })

        this.raf = useRafR(this.update)
        this.destroyStack.add(() => this.raf.kill())

        this.mesh = new Mesh(this.gl, { program, geometry })

        this.mesh.position.y = -1 
        this.mesh.scale.set(4)
        this.mesh.rotation.x = -Math.PI / 2
        this.init()
    }

    init() {
        this.raf.run()
    }

    update({ elapsed }: rafEvent) {
        this.uTime.value = elapsed / 4000
    }

    destroy() {
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;

uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

in vec3 vNormal;
in vec3 vPosition;
in vec2 vUv;
out vec4 FragColor;

${cosinePalette}

void main() {
    vec3 color = vec3(0.9, 0.9, 0.9);

    FragColor = vec4(color, 1.);
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec3 vNormal;
out vec3 vPosition;
out vec2 vUv;

void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;