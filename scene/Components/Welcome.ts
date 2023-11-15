import { CanvasNode } from "../utils/types";

//@ts-ignore
import { Plane, Box, Program, Mesh } from "ogl"
import { cosinePalette } from "../shaders/color";
import type { RafR, rafEvent } from "~/plugins/core/raf";

export class WelcomeGL extends CanvasNode {

    uTime!: { value: number; }
    raf: RafR;
    constructor(gl: any, options?: {}) {
        super(gl)

        N.BM(this, ["update"])


        this.raf = useRafR(this.update)
        this.onDestroy(() => this.raf.kill())

        this.mount()
        this.init()
    }
    mount() {

        this.uTime = { value: 0 }

        const geometry = new Box(this.gl)
        const program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: this.uTime,
                uId: { value: this.uId },
            }
        })
        this.node = new Mesh(this.gl, { program, geometry })
        this.node.scale.set(0.5)

        this.onDestroy(() => {
            this.node.setParent(null)
        })
    }

    init() {
        this.raf.run()
    }

    update({ elapsed }: rafEvent) {
        this.uTime.value = elapsed / 4000
        this.node.rotation.x = elapsed / 2000
        this.node.rotation.y = elapsed / 2000
    }

    destroy() {
        super.destroy()
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;

uniform mat4 modelMatrix;
uniform mat3 normalMatrix;
uniform bool uPicking;
uniform vec4 uId;

in vec3 vNormal;
in vec3 vPosition;
in vec2 vUv;
out vec4 FragColor[2];

${cosinePalette}

void main() {
    vec4 coord = gl_FragCoord;

    vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0 )).xyz;
    vec3 worldNormal = normalize( vec3( modelMatrix * vec4( vNormal, 0.0 ) ) );
    vec3 lightVector = normalize( vec3(-2., 3., 6.) - worldPosition );
    float brightness = dot( worldNormal, lightVector );

    // color = vec3(brightness + 1.)/ 2.;
    // vec3 color = cosinePalette(uTime + coord.y * 0.0004, vec3(0.5), vec3(0.5), vec3(0.9 , 1., 0.85), vec3(0., 0.1, 0.2));
    vec3 color = cosinePalette(uTime + brightness * coord.y * 0.0002, vec3(0.5), vec3(0.5), vec3(0.9 , 1., 0.85), vec3(0., 0.1, 0.2));

    FragColor[0] = vec4(color, 1.);
    FragColor[1] = uId;
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