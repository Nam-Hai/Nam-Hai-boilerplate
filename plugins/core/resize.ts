import { Timer, RafR } from "./raf"

import SassVars from '@/styles/sass/variables.module.scss'
import { BM, Clamp } from "./utils"


type BreakpointType = {
    name: string,
    width: number
}

type DeviceTypes = {
    designSize: {
        width: number,
        height: number
    },
    remScale: {
        min: number,
        max: number
    }
}

type ResizeEvent = {
    vh: number,
    vw: number,
    scale: number,
    breakpoint: string
}

const Ro = new class {
    tick: boolean
    timer: Timer
    arr: {
        id: number,
        cb: (e: ResizeEvent) => void
    }[]

    breakpoints: Record<string, BreakpointType>
    deviceTypes: Record<string, DeviceTypes> = {}
    scale!: number
    vh!: number
    vw!: number
    private breakpoint!: string
    mode: 'fit' | 'width' | 'height'
    // raf: RafR

    constructor() {
        this.tick = false
        this.arr = []

        BM(this, ['fn', 'gRaf', 'run'])
        this.timer = new Timer(this.gRaf, 200)
        window.addEventListener('resize', this.fn)

        this.breakpoints = {}
        this.deviceTypes = {}   // Get breakpoints and device types from Sass
        this.mode = SassVars.scale_mode as 'fit' | 'width' | 'height'
        SassVars.breakpoints.split(',').forEach((b: string) => {
            const point = b.trim()

            this.breakpoints[point] = {
                name: point,
                width: parseInt(SassVars[`breakpoint_${point}_width`]),
            }

            this.deviceTypes[point] = {
                designSize: {
                    width: parseInt(SassVars[`breakpoint_${point}_design_width`]),
                    height: parseInt(SassVars[`breakpoint_${point}_design_height`]),
                },
                remScale: {
                    min: parseFloat(SassVars[`breakpoint_${point}_scale_min`]),
                    max: parseFloat(SassVars[`breakpoint_${point}_scale_max`]),
                },
            }
        })

        this.update()
    }

    add(t: {
        id: number,
        cb: (e: ResizeEvent) => void
    }) {
        const arg = {
            vw: this.vw,
            vh: this.vh,
            scale: this.scale,
            breakpoint: this.breakpoint
        }
        t.cb(arg)
        this.arr.push(t)
    }
    remove(id: number) {
        // for (let t = this.l(); 0 <= t; t--) {
        //     if (this.arr[t].id === id) return void this.arr.splice(t, 1)
        // }
        this.arr = this.arr.filter(el => {
            return el.id != id
        })
    }

    fn() {
        this.timer.tick()
    }
    gRaf() {
        this.update()
        this.tick || (this.tick = true, this.run())
    }
    run() {
        const arg = {
            vw: this.vw,
            vh: this.vh,
            scale: this.scale,
            breakpoint: this.breakpoint
        }
        // for (let t = this.l(); 0 <= t; t--) this.arr[t].cb(arg);
        for (const el of this.arr) {
            el.cb(arg)
        }
        this.tick = false
    }
    l() {
        return this.arr.length - 1
    }

    get callbackArg() {
        return {
            vw: this.vw,
            vh: this.vh,
            scale: this.scale,
            breakpoint: this.breakpoint
        }
    }
    private update() {
        this.updateSize()
        this.updateBreakpoint()
        this.updateScale()
    }
    private updateBreakpoint() {
        const bps = this.breakpoints

        let device = 'mobile'

        for (const k of ['mobile', 'desktop']) {
            if (this.vw >= bps[k].width) {
                device = k
            }
        }
        this.breakpoint = device
    }
    private updateSize() {
        this.vw = innerWidth
        this.vh = innerHeight

        document.documentElement.style.setProperty('--vh', `${this.vh * 0.01}px`)
        document.documentElement.style.setProperty('--100vh', `${this.vh}px`)
    }

    private updateScale() {

        const d = this.deviceTypes[this.breakpoint]
        const scaleX = this.vw / d.designSize.width
        const scaleY = this.vh / d.designSize.height

        // if (this.remlock) {
        // this.scale = 1
        // return
        // }

        // NOTE ACTUAL REMSCALE IS CALCULATED IN CSS
        // src/styles/config/variables.sass
        // src/styles/helpers/breakpoints.sass // =remscale()

        if (this.mode === 'fit') {
            this.scale = Clamp(Math.min(scaleX, scaleY), d.remScale.min, d.remScale.max)
        }
        else if (this.mode === 'width') {
            this.scale = Clamp(scaleX, d.remScale.min, d.remScale.max)
        }
        else if (this.mode === 'height') {
            this.scale = Clamp(scaleY, d.remScale.min, d.remScale.max)
        }
    }
}


let RoId = 0;
class ROR {
    cb: (e: ResizeEvent) => void
    id: number
    triggerCb: (() => void) | undefined
    constructor(cb: (e: {
        vh: number,
        vw: number,
        scale: number,
        breakpoint: string
    }) => void, triggerCb?: ()=> void) {
        this.triggerCb = triggerCb
        this.cb = cb
        this.id = RoId
        RoId++
    }
    on() {
        Ro.add({
            id: this.id,
            cb: this.cb
        })
    }
    off() {
        Ro.remove(this.id)
    }

    trigger() {
        if(this.triggerCb) this.triggerCb()
        this.cb(Ro.callbackArg)
    }
}

export { ROR }
export type { ResizeEvent }
