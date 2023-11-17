export function loadTexture(texture: any, src: string) {
    const image = new Image()
    image.src = src
    image.crossOrigin = 'anonymous'
    image.onload = () => {
        texture.image = image
    }
}

let id = 0
type uIdType = [number, number, number, number]
export function getUId() {
    id++
    const uId: uIdType = [
        // Math.floor(id % 256) / 256,
        // Math.floor((id % (256 * 256)) / (256)) / 256,
        // Math.floor((id % (256 * 256 * 256)) / (256 * 256)),
        // Math.floor((id % (256 * 256 * 256 * 256)) / (256 * 256 * 256))
        ((id >>  0) & 0xFF) / 0xFF,
        ((id >>  8) & 0xFF) / 0xFF,
        ((id >> 16) & 0xFF) / 0xFF,
        ((id >> 24) & 0xFF) / 0xFF,
    ]
    return { id, uId }
}


import { Transform, RenderTarget, Mesh, Camera, Program, Geometry, Plane, Sphere } from 'ogl'
import type { CanvasNode, CanvasPage } from './types'
import type { WatchSource, WatchCallback } from 'nuxt/dist/app/compat/capi'
import type { MultiWatchSources } from 'nuxt/dist/app/composables/asyncData'

// fast object to get ogl class
export const O = {
    RenderTarget,
    Transform,
    Mesh,
    Camera,
    Program,
    Geometry,
    Plane,
    Sphere
}

export class EventHandler {
    // callbacks: { event: string, cb: (e: any) => void }[]
    cbs: Map<string, Array<(e: any) => void>>
    constructor() {
        // this.callbacks = []
        this.cbs = new Map()
    }

    on(event: string, cb: (e: any) => void) {
        // if (!this.callbacks[event]) this.callbacks[event] = [];
        // this.callbacks[event].push(cb)
        // this.callbacks.push({ event, cb })
        if (this.cbs.has(event)) {
            const array = this.cbs.get(event)!
            array.push(cb)
            this.cbs.set(event, array)
        } else {
            this.cbs.set(event, [cb])
        }
    }

    emit(event: string, data?: any) {
        // const callbacks = this.callbacks[event]
        // if (!callbacks) return
        // for (const cb of callbacks) {
        //     cb(data)
        // }

        // for (const a of this.callbacks) {
        //     if (a.event == event) a.cb(a)
        // }

        if (this.cbs.has(event)) {
            const callbacks = this.cbs.get(event)!
            for (const cb of callbacks) {
                cb(data)
            }
        }
    }

    remove(event: string) {
        // this.callbacks.remove(event)
        // this.callbacks.filter(el => {
        //     return el.event != event
        // })

        this.cbs.delete(event)
    }
}

export function plugWatch(ctx: CanvasPage) {
    return function canvasWatch(ref: MultiWatchSources | WatchSource | WatchCallback, callback: WatchCallback) {
        const unWatch = watch(ref, callback)
        ctx.onDestroy(() => unWatch())
    }
}

export function plugReactivity(ctx: CanvasPage, reactivity: (...args: any[]) => () => void) {
    return function canvasReactivity(...args: any[]) {
        const unWatch = reactivity(...args)
        ctx.onDestroy(() => unWatch())
    }
}

export function canvasWatch(ctx: CanvasNode, ref: MultiWatchSources | WatchSource | WatchCallback, callback: WatchCallback) {
    const unWatch = watch(ref, callback)
    ctx.onDestroy(() => unWatch())
}