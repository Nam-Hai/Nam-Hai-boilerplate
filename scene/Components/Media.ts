import { RafR, rafEvent } from "~/plugins/core/raf";
import { ROR, ResizeEvent } from "~/plugins/core/resize";
import Callstack from "../utils/Callstack";

// @ts-ignore
import { Vec2, Program, Mesh, Color, Plane } from 'ogl'
import { basicFrag } from "../shaders/BasicFrag";
import { basicVer } from "../shaders/BasicVer";
import { Timeline } from "~/plugins/core/motion";
import FlowMap from "../Passes/FlowMap";

const { vh, vw, scale, mask } = useStore()
const ZOOM = 0.06

export default class Media {
    gl: any;
    raf: RafR;
    ro: ROR;
    callStack: Callstack;
    mesh: any;
    canvasSize: { width: number; height: number; };
    uSize: { value: any; };
    uIntrinsecRatio: { value: number; };
    id: number;
    postion: any;
    scale: any;
    tl: Timeline;
    animeParams: { delay: number; duration: number; };
    flowMap: FlowMap;
    uResolution: { value: number[]; };
    uFlowForce: { value: number; };
    uZoom: { value: number; };
    uCanvasSize: { value: number[]; };
    uDeform: { value: number; };



    constructor(gl: any, props: { id: number }) {
        N.BM(this, ['update', 'onResize', 'destroy'])


        this.gl = gl
        this.id = props.id

        this.tl = useTL()

        this.uSize = { value: new Vec2(1, 1) }
        this.postion = new Vec2(0, 0)
        this.scale = new Vec2(1, 1)
        this.uFlowForce = { value: 0 }
        this.uZoom = { value: 1 }
        this.uDeform = { value: 0 }
        this.uResolution = { value: [vw.value * devicePixelRatio, vh.value * devicePixelRatio] }




        this.uCanvasSize = { value: [1, 1] }

        this.animeParams = {
            delay: 0,
            duration: 1000
        }

        const manifest = useManifest()



        this.flowMap = new FlowMap(this.gl)

        const texture = manifest.textures.background[this.id]
        this.uIntrinsecRatio = { value: 1 }
        this.uIntrinsecRatio.value = texture.image.width / texture.image.height

        const geometry = new Plane(this.gl, {
            widthSegments: 80,
            heightSegments: 80,
        })

        const program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                tMap: { value: texture },
                tFlow: this.flowMap.uniform,
                uSize: this.uSize,
                uIntrinsecRatio: this.uIntrinsecRatio,
                uId: { value: this.id + 1 },
                uPicking: { value: false },
                uResolution: this.uResolution,
                uFlowForce: this.uFlowForce,
                uZoom: this.uZoom,
                uDeform: this.uDeform,
                uCanvasSize: this.uCanvasSize
            }
        })

        this.mesh = new Mesh(this.gl, {
            geometry,
            program
        })





        let maskTL = useTL()
        const maskUnwatch = watch(mask, value => {
            maskTL.pause()
            maskTL = useTL()
            const fromZoom = this.uZoom.value
            const fromDeform = this.uDeform.value
            const toZoom = !value ? 1 : ZOOM
            const toDeform = !value ? 0 : 1

            maskTL.from({
                d: 1500,
                e: 'o2',
                // delay: 500,
                update: ({ progE }) => {
                    this.uDeform.value = N.Lerp(fromDeform, toDeform, progE)
                }
            }).from({
                d: 1200,
                e: 'io3',
                update: ({ progE }) => {
                    this.uZoom.value = N.Lerp(fromZoom, toZoom, progE)
                }

            })
                .from({
                    d: 500,
                    update: ({ progE }) => {
                        this.uFlowForce.value = N.Lerp(+value, +!value, progE)
                    }
                })
                .play()
        })

        this.raf = useRafR(this.update)
        this.ro = useROR(this.onResize)

        const { canvasSize, unWatch } = useCanvasSize((cSize) => {
            this.canvasSize = cSize
            this.ro.trigger()
        })

        this.canvasSize = canvasSize
        this.init()

        this.callStack = new Callstack([() => this.raf.stop(), () => this.ro.off(), () => unWatch(), () => maskUnwatch(), () => this.flowMap.destroy()])
    }


    setSize() {
        this.mesh.scale.set(
            this.canvasSize.width,
            this.canvasSize.height,
            1
        )
        this.uSize.value.copy(this.scale)
    }


    init() {
        this.raf.run()

        useTL().from({
            d: 3000,
            delay: 1000,
            update: ({ progE }) => {
                this.uFlowForce.value = progE
            }
        }).play()
    }

    update(e: rafEvent) {
        this.flowMap.render()
    }

    onResize() {
        const dpr = devicePixelRatio
        this.uResolution.value = [vw.value * dpr, vh.value * dpr]
        this.scale.x = vw.value
        this.scale.y = vh.value

        this.uCanvasSize = { value: [this.canvasSize.width, this.canvasSize.height] }

        this.setSize()
    }

    onBeforePicking() {
        this.mesh.program.uniforms.uPicking.value = true
    }
    onAfterPicking() {
        this.mesh.program.uniforms.uPicking.value = false
    }

    destroy() {
        this.callStack.call()
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tFlow;

uniform vec2 uSize;
uniform float uIntrinsecRatio;
uniform bool uPicking;
uniform float uId;
uniform float uZoom;

uniform vec2 uResolution;
uniform float uFlowForce;

in vec2 vUv;
out vec4 FragColor;


void main() {
    // object-fix: cover
    vec2 s = vec2(uSize.x / uSize.y < uIntrinsecRatio ? uSize.x / (uSize.y * uIntrinsecRatio) : 1., uSize.x / uSize.y < uIntrinsecRatio ? 1. : uSize.y * uIntrinsecRatio / (uSize.x));
    vec2 t = vec2(uSize.x / uSize.y < uIntrinsecRatio ? 0.5 * ( 1. - uSize.x / (uSize.y * uIntrinsecRatio)) : 0. , uSize.x / uSize.y <= uIntrinsecRatio ? 0. : (1. - uSize.y * uIntrinsecRatio / (uSize.x)) * 0.5 );
    vec4 color = vec4(1.);
   

    vec4 flow = texture(tFlow, gl_FragCoord.xy / uResolution.x);
    color = texture(tMap, vUv * s * uZoom  + t + (1. - uZoom) * 0.5 * vec2(s.x, s.y-0.34) + (vec2(-flow.b * (flow.r + flow.g)/ 80. * uFlowForce, 0.)  + vec2(uFlowForce * (-flow.r + flow.g) / 7., 0.)) );
    // color = texture(tMap, vUv * s  + t + vec2(-flow.b * (flow.r + flow.g)/ 100., 0.) * uFlowForce + vec2(uFlowForce * (-flow.r + flow.g) / 10., 0.));
    color.rgb += uFlowForce * (flow.b) * (flow.r + flow.g) / 20.;

    vec2 r = vec2(uResolution.x / uResolution.y < 1. ? uResolution.x / uResolution.y : 1., uResolution.x / uResolution.y < 1. ? 1. : uResolution.y  / uResolution.x);
    vec2 centerCoord = vec2((vUv.x - 0.5) , (vUv.y - 0.5 )) * r;

    float d = sqrt(centerCoord.x * centerCoord.x + (centerCoord.y + .16 * r.y) * (centerCoord.y  + .16 * r.y ));
    color -= vec4(255.) * ( smoothstep(d, d + 5.,1. - uZoom));
    // color = flow;
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
uniform float uZoom;
uniform vec2 uCanvasSize;

out vec2 vUv;

float iLerp(float a, float b, float value) {
    return (value - a) / (b - a);
}
float io2(float t) {
    float p = 2.0 * t * t;
    return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}


void main() {
    vUv = uv;

  vec4 newP = modelViewMatrix * vec4(position, 1.);

    newP.z -= ( cos(newP.x / uCanvasSize.x * newP.y / uCanvasSize.y / 3. ) - 1.  - .2 * length(newP)) * iLerp(1., ${ZOOM}, uZoom) * 0.8  ;
    // float force = 1.7;
    // newP.z -= force;

    // float d = length(uCanvasSize) * 2.;
    // float a = mix(-1., d + 1. , uDeform);
    // newP.z += 0.8 * (1. - io2(clamp(iLerp( a, a + 1.,  sqrt(newP.x * newP.x + (newP.y  + 0.34 * uCanvasSize.y) * (newP.y + 0.34 * uCanvasSize.y))) , 0. ,1.) ));
    // newP.z += 2.5 * (1. -  smoothstep( 0., 1., abs(a -  sqrt(newP.x * newP.x + newP.y * newP.y) )));

  gl_Position = projectionMatrix * newP;
}`;