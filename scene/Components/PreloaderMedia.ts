import { RafR, rafEvent } from "~/plugins/core/raf";
import { ROR, ResizeEvent } from "~/plugins/core/resize";
import Callstack from "../utils/Callstack";

// @ts-ignore
import { Vec2, Program, Mesh, Color, Plane } from 'ogl'

const { vh, vw, scale } = useStore()
export const IMAGE_BASE = {
    width: 300,
    height: 150
}

export default class PreloaderMedia {
    gl: any;
    raf: RafR;
    ro: ROR;
    callStack: Callstack;
    mesh: any;
    canvasSize: { width: number; height: number; };
    uSize: { value: any; };
    uBorderRadius: { value: number; };
    uIntrinsecRatio: { value: number; };
    id: number;
    scale: any;
    position: any;
    offset: any;
    sideP: number;
    uDeform: { value: number; };
    uCanvasSize: { value: number[]; };
    deformT: { old: number; new: number; };
    fix: number = 0;
    uZoom: { value: number; };

    constructor(gl: any, props: { id: number, borderRadius: number }) {
        N.BM(this, ['update', 'onResize', 'destroy'])

        this.gl = gl
        this.id = props.id


        this.uSize = { value: new Vec2(1, 1) }

        this.uBorderRadius = { value: props.borderRadius }

        this.uDeform = { value: 0 }
        this.deformT = { old: 0, new: 0 }
        this.uCanvasSize = { value: [0, 0] }
        this.uZoom = { value: 1 }

        const manifest = useManifest()

        const texture = manifest.textures.background[this.id % manifest.textures.background.length]
        this.uIntrinsecRatio = { value: 1 }
        this.uIntrinsecRatio.value = texture.image.width / texture.image.height

        const geometry = new Plane(this.gl, {
            widthSegments: 30,
            heightSegments: 30,
        })

        const program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                tMap: { value: texture },
                uSize: this.uSize,
                uBorderRadius: this.uBorderRadius,
                uIntrinsecRatio: this.uIntrinsecRatio,
                uDeform: this.uDeform,
                uCanvasSize: this.uCanvasSize,
                uZoom: this.uZoom
            }
        })

        this.mesh = new Mesh(this.gl, {
            geometry,
            program
        })

        this.scale = new Vec2(IMAGE_BASE.width * scale.value, IMAGE_BASE.height * scale.value)
        this.position = new Vec2(vw.value, 0)
        this.offset = new Vec2(0, 0)

        this.sideP = 0

        this.ro = useROR(this.onResize)
        this.raf = useRafR(this.update)

        const { canvasSize, unWatch } = useCanvasSize((cSize) => {
            this.canvasSize = cSize
            this.uCanvasSize.value = [cSize.width, cSize.height]
            this.ro.trigger()
        })

        this.canvasSize = canvasSize

        this.callStack = new Callstack([() => unWatch(), this.raf.stop])
    }


    init() {

        this.raf.run()
    }

    update(e: rafEvent) {
        // this.uDeform.value = 1000 * (this.deformT.new - this.deformT.old) / e.delta
        // this.deformT.old = this.deformT.new

        this.mesh.scale.set(
            this.canvasSize.width * this.scale.x / vw.value,
            this.canvasSize.height * this.scale.y / vh.value,
            1
        )
        this.mesh.position.set(
            (this.position.x + this.fix + this.offset.x + this.sideP) * this.canvasSize.width / vw.value,
            (this.position.y) * this.canvasSize.width / vw.value,
            0
        )
    }

    onResize() {

        this.uSize.value.copy(this.scale)
    }

    destroy() {
        this.callStack.call()
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;

uniform vec2 uSize;
uniform float uBorderRadius;
uniform float uIntrinsecRatio;
uniform float uZoom;

in vec2 vUv;
out vec4 FragColor;


void main() {
    // object-fix: cover
    vec2 s = vec2(uSize.x / uSize.y < uIntrinsecRatio ? uSize.x / (uSize.y * uIntrinsecRatio) : 1., uSize.x / uSize.y < uIntrinsecRatio ? 1. : uSize.y * uIntrinsecRatio / (uSize.x));
    vec2 t = vec2(uSize.x / uSize.y < uIntrinsecRatio ? 0.5 * ( 1. - uSize.x / (uSize.y * uIntrinsecRatio)) : 0. , uSize.x / uSize.y <= uIntrinsecRatio ?  0. : (1. - uSize.y * uIntrinsecRatio / (uSize.x)) * 0.5 );
    vec4 color = vec4(1.);
   

    color = texture(tMap, vUv * s * uZoom + t + s * (1. - uZoom) * 0.5);
    // color = vec4(1., 0., 1., 1.);
    FragColor = color;
}
`
const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uDeform;
uniform vec2 uCanvasSize;

out vec2 vUv;

void main() {
  vUv = uv;
  vec4 newP = modelViewMatrix * vec4(position, 1.);
//   newP.z += -.5 * cos(4. * newP.x / uCanvasSize.x) * uDeform;
//   newP.z += -.5 * cos(4. * newP.y / uCanvasSize.y) * uDeform;
    // float force = 1.7;
    // newP.z -= force;

    // float d = length(uCanvasSize);
    // float a = mix(d / 2., - d * 1.3 , uDeform);
    // newP.z += force * smoothstep( a -uCanvasSize.x / 3., a + uCanvasSize.x/ 3.,  1.5 * newP.x - newP.y );
  gl_Position = projectionMatrix * newP;
}`;


