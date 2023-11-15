
import { Geometry, Camera, Transform } from 'ogl'
import { RafR } from "~/plugins/core/raf"
import Line from "./Line"
import { ROR } from "~/plugins/core/resize"
import PostProcessor from '../PostProcessor'
import { basicVer } from '../shaders/BasicVer'
import Callstack from '../utils/Callstack'

export default class MouseLine {
    lines: Line[]
    uResolution: { value: number[] }
    gl: any
    raf: RafR
    ro: ROR
    x: any
    y: any
    sizePixel: any
    scene: any
    canvasSize: { width: number; height: number }
    vw: globalThis.Ref<number>
    vh: globalThis.Ref<number>
    camera: any
    // post: PostProcessor
    mouse: { x: number; y: number }
    uMouse: { value: number[] }
    post: PostProcessor
    callstack: Callstack
    constructor(gl: any, { color }: { color: [number, number, number, number] } = { color: [1, 1, 1, 1] }) {
        const { mouse, vh, vw } = useStoreView()
        this.vw = vw
        this.vh = vh
        N.BM(this, ['update', 'onScroll', 'resize', 'computeNextLine'])
        this.gl = gl

        this.scene = new Transform()
        this.raf = useRafR(this.update)
        this.ro = useROR(this.resize)
        this.uResolution = { value: [innerWidth, innerHeight] }


        const { size: canvasSize } = useCanvas()
        this.canvasSize = canvasSize.value
        this.mouse = mouse
        this.uMouse = { value: [this.mouse.x, this.mouse.y] }
        const unWatchMouse = watch(mouse, (m) => {
            this.computeNextLine(m.x, m.y)
            this.uMouse.value[0] = m.x
            this.uMouse.value[1] = m.y
        })



        this.camera = new Camera(this.gl, {
            left: -canvasSize.value.width / 2,
            right: canvasSize.value.width / 2,
            top: canvasSize.value.height / 2,
            bottom: -canvasSize.value.height / 2,
        });

        // this.mouse = mouse

        this.post = new PostProcessor(this.gl, {
        })

        this.post.addPass({
            vertex,
            fragment,
            uniforms: {
                uMouse: this.uMouse,
                uResolution: this.uResolution,
            }
        })



        this.lines = N.Arr.create(100).map(i => {
            let line = new Line(this.gl, { color })
            line.mesh.setParent(this.scene)
            return line
        })

        this.init()

        const lenis = useLenis()
        const lenisUnSubscribe = lenis.on('scroll', this.onScroll)

        this.callstack = new Callstack([() => unWatchMouse(), () => this.raf.stop(), () => this.ro.off(), () => this.post.destroy(), () => lenisUnSubscribe()])
    }
    init() {
        this.raf.run()
        this.ro.on()
    }
    computeNextLine(x: number, y: number) {

        let startingLine = this.lines[0]
        let nextLine = this.lines.pop()!
        nextLine.mesh.geometry.remove()
        nextLine.position.x = (x - this.vw.value / 2) * this.canvasSize.width / this.vw.value
        nextLine.position.y = (this.vh.value / 2 - y) * this.canvasSize.height / this.vh.value

        nextLine.mesh.scale.y = 1
        nextLine.mesh.geometry = new Geometry(this.gl, {
            position: { size: 3, data: new Float32Array([nextLine.position.x, nextLine.position.y, 0, startingLine.position.x, startingLine.position.y, 0]) },
            uv: { size: 2, data: new Float32Array([0, 0, 1, 1]) },
            index: { data: new Uint16Array([0, 1]) }
        })
        // nextLine.mesh.geometry.updateAttribute()
        this.lines.unshift(nextLine)


    }

    onScroll({ animatedScroll }: any) {
        // let a = N.Clamp((this.maskBound - animatedScroll + this.vh.value * 0.5) / this.vh.value, 0., 1)
        // this.uMask.value = a
    }

    resize({ vh, vw }: { vh: number, vw: number }) {
        this.uResolution.value = [vw, vh]
        const { size: canvasSize } = useCanvas()
        this.canvasSize = canvasSize.value
    }

    update() {
        this.computeNextLine(this.mouse.x, this.mouse.y)
    }

    destroy() {
        this.callstack.call()
        this.lines.forEach((line) => {
            line.destroy()
        })
    }
}

const fragment = /* glsl */ `#version 300 es
precision mediump float;
in vec2 vUv;

uniform sampler2D tMap;
uniform vec2 uMouse;
uniform vec2 uResolution;

out vec4 FragColor;
void main() {
    vec4 color = texture(tMap, vUv);
    FragColor = color;

    float x = uMouse.x / uResolution.x;
    float y = uMouse.y / uResolution.y;
    float dx = x - vUv.x;
    dx *= uResolution.x / uResolution.y;
    float dy = y - (1. - vUv.y);
    float dist = sqrt(dx*dx + dy*dy) * 50.;

    //mask cursor
    color = mix(color, vec4(0.), step(dist, 1.));
    
    FragColor = color;
}
`

const vertex = /* glsl */ `#version 300 es
precision mediump float;
in vec2 uv;
in vec2 position;

out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1.); 
}
`

