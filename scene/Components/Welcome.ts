import { CanvasNode } from "../utils/types";

//@ts-ignore
import { Plane, Box, Program, Mesh, Vec3, GPGPU, Transform } from "ogl"
import { cosinePalette } from "../shaders/color";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import Callstack from "../utils/Callstack";
import { useCanvasReactivity } from "../utils/WebGL.utils";
import PostProcessor from "../PostProcessor";
import { basicVer } from "../shaders/BasicVer";
import { basicFrag } from "../shaders/BasicFrag";

export class WelcomeGL extends CanvasNode {

    uTime!: { value: number; }
    raf: RafR;
    clickCallstack: Callstack;
    position: any;
    gpgpu!: GPGPU;
    post!: PostProcessor;
    constructor(gl: any, options?: {}) {
        super(gl)

        N.BM(this, ["update"])


        this.raf = useRafR(this.update)
        this.onDestroy(() => {
            this.raf.kill()
        })

        this.node = new Transform()

        this.mount()
        this.init()


        this.clickCallstack = new Callstack()
    }

    onClick(id: number, callback: () => void) {

    }

    mount() {

        this.uTime = { value: 0 }

        this.mountGPGPU()
    }

    mountGPGPU() {
        const numParticles = 2000;

        // Create the initial data arrays for position and velocity. 4 values for RGBA channels in texture.
        const data = new Float32Array(numParticles * 4);
        const random = new Float32Array(numParticles * 4);
        for (let i = 0; i < numParticles; i++) {
            data.set(
                [
                    0,
                    0,
                    0,
                    1
                ],
                i * 4
            );
            random.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1], i * 4);
        }
        this.gpgpu = new GPGPU(this.gl, { data })

        this.gpgpu.addPass({
            fragment: fragmentGPGPU,
            vertex: defaultVertex,
            uniforms: {
                uTime: this.uTime,
            }
        })

        const geometry = new Box(this.gl, {
            attributes: {
                // coord of the data in texture
                coords: { instanced: 1, size: 2, data: this.gpgpu.coords },
                random: { instanced: 1, size: 4, data: random }
            }
        })
        const program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: this.uTime,
                tPosition: this.gpgpu.uniform,
                uId: { value: this.uId },
            }
        })
        console.log(geometry);
        const mesh = new Mesh(this.gl, { program, geometry })
        mesh.setParent(this.node)

    }

    init() {
        this.raf.run()
    }

    update(e: rafEvent) {
        this.uTime.value = e.elapsed / 1000
        // this.node.rotation.x = elapsed / 2000
        // this.node.rotation.y = elapsed / 2000

        const canvas = useCanvas()
        this.gpgpu.render()
        this.gl.renderer.render({
            scene: this.node,
            camera: canvas.camera
        })
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

in vec4 vRand;
in vec3 vNormal;
in vec3 vPosition;
in vec2 vUv;
out vec4 FragColor[2];

${cosinePalette}

void main() {
    vec4 coord = gl_FragCoord + vRand;

    vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0 )).xyz;
    vec3 worldNormal = normalize( vec3( modelMatrix * vec4( vNormal, 0.0 ) ) );
    vec3 lightVector = normalize( vec3(-2., 3., 6.) - worldPosition );
    float brightness = dot( worldNormal, lightVector );

    // color = vec3(brightness + 1.)/ 2.;
    // vec3 color = cosinePalette(uTime + coord.y * 0.0004, vec3(0.5), vec3(0.5), vec3(0.9 , 1., 0.85), vec3(0., 0.1, 0.2));
    vec3 color = cosinePalette(uTime + vRand.x + uId.x * 20. + brightness * coord.y * 0.0002, vec3(0.5, 0.2, .5), vec3(0.5, 0.6, 0.5), vec3(0.9 , .5, 0.85), vec3(0.5, 0.1, -0.9));

    FragColor[0] = vec4(color, 1.);
    FragColor[1] = uId;
}
`

const vertex = /* glsl */`#version 300 es
precision highp float;

in vec2 coords;

in vec3 position;
in vec2 uv;
in vec3 normal;
in vec4 random;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform sampler2D tPosition;

out vec4 vRand;
out vec3 vNormal;
out vec3 vPosition;
out vec2 vUv;

void main() {

    vUv = uv;
    vRand = random;
    vNormal = normal;
    vPosition = position;
    vec4 tposition = texture(tPosition, coords);

    tposition.xyz += position.xyz + random.xyz;
    // gl_Position = vec4(position.xyz, 1.);
    // gl_Position = vec4(0.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(tposition.xyz, 1.);
}`;

const fragmentGPGPU = /* glsl */`#version 300 es
precision highp float;

uniform float uTime;
uniform sampler2D tMap;

in vec2 vUv;
out vec4 FragColor;

void main() {
    vec4 data = texture(tMap, vUv);
    data = vec4(sin(uTime + vUv.x * 5. + vUv.y * 5.), cos(uTime + vUv.y * 20.), sin(uTime + 0.2) , 1.);
    data.w = 1.;
    FragColor = data;
}`;
const defaultVertex = /* glsl */ `#version 300 es
in vec2 uv;

in vec2 position;
out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 0., 1.);
}
`;