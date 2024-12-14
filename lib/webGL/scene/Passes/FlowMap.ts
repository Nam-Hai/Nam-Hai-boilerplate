
import { Triangle, Transform, Mesh, Program, Plane, Vec2, RenderTarget } from 'ogl'
import Callstack from '../utils/Callstack'
import { Clock } from '../utils/Clock'
import { ROR, type ResizeEvent } from '~/plugins/core/resize'

const { vh, vw, mouse } = useStoreView()
export class FlowMap {
    gl: any
    clock: Clock
    uResolution: { value: number[] }
    ro: ROR
    mouse: any
    oldMouse: any
    velo: any
    uVelo: any
    delta: number
    bufferRenderObject: { mesh: any; scene: any }
    callstack: Callstack
    enabled: boolean
    mask!: { write: any; read: any; swap: () => void }
    uniform: any
    canvasSize: globalThis.Ref<{ width: number; height: number }>
    constructor(gl: any, { enabled = true } = {}) {
        this.enabled = enabled
        N.BM(this, ['mousemove', 'resize'])
        this.gl = gl
        this.clock = new Clock

        this.uResolution = { value: [vw.value * devicePixelRatio, vh.value] }
        this.ro = useROR(this.resize)
        const { canvasSize, unWatch: unWatchCanvas } = useCanvasSize(() => this.ro.trigger())
        this.canvasSize = canvasSize


        this.mouse = new Vec2(-1)
        this.oldMouse = new Vec2()
        this.velo = new Vec2(-1)
        this.uVelo = new Vec2(0)
        this.delta = 0

        this.bufferRenderObject = this.createPlaneBuffer()

        const unWatch = watch(mouse, this.mousemove)

        this.callstack = new Callstack([() => unWatch(), () => unWatchCanvas()])
    }
    resize({ vh, vw }: ResizeEvent) {
        this.uResolution.value = [vw * devicePixelRatio, vh]
    }

    mousemove(e: { x: number, y: number }) {
        const x = e.x / vw.value
        const y = 1 - (e.y) / vh.value
        this.bufferRenderObject.mesh.program.uniforms.uMouse.value = [x, y]

        this.mouse.set(x, y)

        let delta = this.clock.getDelta() || 14
        this.velo.x = 100 * (this.mouse.x - this.oldMouse.x) / delta
        this.velo.y = (this.mouse.y - this.oldMouse.y) / delta


        this.velo.x = Math.sign(this.velo.x) * N.Clamp(N.Ease.i1(Math.abs(this.velo.x)), 0, 0.7)
        this.oldMouse.set(x, y)
        this.velo.needsUpdate = true
    }

    toggleEffect() {
        this.enabled = !this.enabled
        // this.pass.enabled = this.enabled
    }

    render() {
        if (!this.velo.needsUpdate) {
            this.mouse.set(-1)
            this.velo.set(0)
        }
        this.velo.needsUpdate = false
        this.uVelo.lerp(this.velo, 0.1)
        this.bufferRenderObject.mesh.program.uniforms.uVelocity.value = this.uVelo

        this.gl.renderer.render({
            scene: this.bufferRenderObject.scene,
            target: this.mask.write,
            clear: false
        })
        this.mask.swap()
        this.gl.renderer.render({
            scene: this.bufferRenderObject.scene,
            // target: this.mask.write,
            clear: false
        })
    }

    createPlaneBuffer() {
        const size = 128, // default size of the render targets
            falloff = 0.3, // size of the stamp, percentage of the size
            alpha = 1, // opacity of the stamp
            dissipation = 0.98, // affects the speed that the stamp fades. Closer to 1 is slower
            sceneBuffer = new Transform()

        this.uniform = { value: null }

        let gl = this.gl
        let type = gl.HALF_FLOAT
        let minFilter = (() => {
            if (gl.renderer.isWebgl2) return gl.LINEAR;
            if (gl.renderer.extensions[`OES_texture_${type === gl.FLOAT ? '' : 'half_'}float_linear`]) return gl.LINEAR;
            return gl.NEAREST;
        })();
        let option = {
            width: vw.value * devicePixelRatio,
            height: 1,
            minFilter,
            internalFormat: gl.renderer.isWebgl2 ? (type === gl.FLOAT ? gl.RGBA32F : gl.RGBA16F) : gl.RGBA,
            format: gl.RGBA,
            depth: false,
            type
        }

        this.mask = {
            write: new RenderTarget(this.gl, option),
            read: new RenderTarget(this.gl, option),
            swap: () => {
                let temp = this.mask.read
                this.mask.read = this.mask.write
                this.mask.write = temp
                this.uniform.value = this.mask.read.texture
            }
        }
        this.mask.swap()
        const resolution = { value: new Vec2() }
        resolution.value.set(this.gl.canvas.width, this.gl.canvas.height)
        let programBuffer = new Program(this.gl, {
            fragment: fragmentGridMap,
            vertex: defaultVertex,
            uniforms: {
                tMap: this.uniform,

                // uFalloff: { value: falloff * 0.5 },
                uAlpha: { value: alpha },
                uDissipation: { value: dissipation },

                uMouse: { value: this.mouse },
                uVelocity: { value: this.uVelo },

                uResolution: this.uResolution,
            },
        })

        let backgroundBufferMesh = new Mesh(this.gl, {
            geometry: new Triangle(this.gl),
            program: programBuffer,
        })

        let renderObject = {
            mesh: backgroundBufferMesh, scene: sceneBuffer,
        }

        backgroundBufferMesh.setParent(sceneBuffer)

        backgroundBufferMesh.scale.x = this.canvasSize.value.width
        backgroundBufferMesh.scale.y = this.canvasSize.value.height

        return renderObject
    }

    destroy() {
        this.callstack.call()
    }
}


const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform float uTime;

uniform float uFalloff;
uniform float uAlpha;
uniform float uDissipation;

uniform vec2 uMouse;
uniform vec2 uVelocity;

uniform vec2 uResolution;

in vec2 vUv;
out vec4 FragColor;

void main() {
    vec2 uv = vUv;
    vec4 oldTexture = texture(tMap, uv) * uDissipation;

    vec2 cursor = vUv - uMouse;
    cursor.x *= uResolution.x / uResolution.y;

    float f = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha * length(uVelocity);
    float a = clamp(f + oldTexture.a, 0.,1.);
    // FragColor = vec4(uResolution.y);
    FragColor = vec4(a);
}
`;

const defaultVertex = /* glsl */ `#version 300 es
    in vec2 uv;
    in vec2 position;
    out vec2 vUv;


    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;

const fragmentGridMap = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;

uniform vec2 uMouse;

uniform vec2 uResolution;
uniform sampler2D tMap;
uniform vec2 uVelocity;

uniform float uAlpha;
uniform float uDissipation;

out vec4 FragColor;

void main() {
  vec4 oldTexture = texture(tMap, vUv) * uDissipation;
  oldTexture.b = 0.;
  float tileWidth = 200.;
  vec2 gridWidth = vec2(uResolution.x / tileWidth, uResolution.y / tileWidth);

  float stampWidth = 3.;

  vec2 newO = vec2(ceil(uMouse.x *gridWidth.x), ceil(uMouse.y * gridWidth.y))/ stampWidth;
  vec2 newP = vec2(ceil(vUv.xy * gridWidth.xy)) / stampWidth;
    float inX =  (2. * mod(vUv.x * gridWidth.x, 1.)) -1.;
    inX = inX * inX * inX * inX * inX * inX * inX;

  vec2 D = vec2(newO.x - newP.x, newO.y - newP.y);
  float d = sqrt(D.x * D.x );

  float f = clamp((1. - abs(d)), 0. , 1.);

  vec4 color = vec4(f * max(uVelocity.x, 0.),f * max(-uVelocity.x,0.), 0.,1.);
  color.b = inX;
  FragColor = vec4(oldTexture + uAlpha *  color );
//   FragColor.a = 1.;
}
`