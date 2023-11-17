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
        ((id >> 0) & 0xFF) / 0xFF,
        ((id >> 8) & 0xFF) / 0xFF,
        ((id >> 16) & 0xFF) / 0xFF,
        ((id >> 24) & 0xFF) / 0xFF,
    ]
    return { id, uId }
}


import { Transform, RenderTarget, Mesh, Camera, Program, Geometry, Plane, Sphere } from 'ogl'
import type { CanvasNode, CanvasPage } from './types'
import type { WatchSource, WatchCallback, ComputedGetter, DebuggerOptions } from 'nuxt/dist/app/compat/capi'
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
    cbs: Map<string, Array<(e: any) => void>>
    constructor() {
        this.cbs = new Map()
    }

    on(event: string, cb: (e: any) => void) {
        if (this.cbs.has(event)) {
            const array = this.cbs.get(event)!
            array.push(cb)
            this.cbs.set(event, array)
        } else {
            this.cbs.set(event, [cb])
        }
    }

    emit(event: string, data?: any) {
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


export function useCanvasReactivity(ctx: CanvasNode) {
    function canvasWatch(ref: MultiWatchSources | WatchSource | WatchCallback, callback: WatchCallback) {
        const unWatch = watch(ref, callback)
        ctx.onDestroy(() => unWatch())
    }

    return {
        watch: canvasWatch
    }
}