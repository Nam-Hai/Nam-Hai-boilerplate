import { CanvasNode } from "../utils/types";

//@ts-ignore
import { Plane, Box, Program, Mesh, Vec3 } from "ogl"
import { cosinePalette } from "../shaders/color";
import type { RafR, rafEvent } from "~/plugins/core/raf";
import Callstack from "../utils/Callstack";
import { canvasWatch, plugWatch } from "../utils/WebGL.utils";

export class WelcomeGL extends CanvasNode {

    uTime!: { value: number; }
    raf: RafR;
    clickCallstack: Callstack;
    position: any;
    constructor(gl: any, options?: {}) {
        super(gl)

        N.BM(this, ["update"])


        this.raf = useRafR(this.update)
        this.onDestroy(() => {
            this.raf.kill()
        })

        this.mount()
        this.init()


        this.clickCallstack = new Callstack()
    }

    onClick(id: number, callback: () => void) {

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
        // console.log(this.uId, this.id);
        this.node = new Mesh(this.gl, { program, geometry })
        this.node.scale.set(0.5)

        this.node.position.set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
        )
        this.position = this.node.position.clone()

        this.onDestroy(() => {
            this.node.setParent(null)
        })

        const picker = usePick(this)
        const tl = useTL()
        const { hover } = picker.useHover(this.id);
        picker.onClick(this.id, () => {
            tl.reset()
            const newPos = new Vec3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
            )
            tl.from({
                d: 500,
                e: 'io1',
                update: ({ prog, progE }) => {
                    this.position.lerp(newPos, progE)
                    this.node.position.set(this.position)
                },
            }).play()
        })

        const tlScale = useTL()
        canvasWatch(this, hover, (hover) => {
            tlScale.reset()
            const scale = this.node.scale.clone()
            const scaleTo = hover ? new Vec3(0.8) : new Vec3(0.5)
            tlScale.from({
                d: 500,
                e: 'io1',
                update: ({ prog, progE }) => {
                    scale.lerp(scaleTo, progE)
                    this.node.scale.set(scale)
                },
            }).play()
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
    vec3 color = cosinePalette(uTime + uId.x * 20. + brightness * coord.y * 0.0002, vec3(0.5), vec3(0.5), vec3(0.9 , 1., 0.85), vec3(0., 0.1, 0.2));

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