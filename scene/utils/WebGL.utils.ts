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

import type { CanvasNode, CanvasPage } from './types'
import type { WatchSource, WatchCallback, ComputedGetter, DebuggerOptions } from 'nuxt/dist/app/compat/capi'
import type { MultiWatchSources } from 'nuxt/dist/app/composables/asyncData'


let EventID = 0
export class EventHandler {
     cbs: Map<number, Array<(e: any) => void>>
    constructor() {
        this.cbs = new Map()
    }

    on(id: number, cb: (e: any) => void) {
        if (this.cbs.has(id)) {
            const array = this.cbs.get(id)!
            array.push(cb)
            this.cbs.set(id, array)
        } else {
            this.cbs.set(id, [cb])
        }
    }

    emit(id: number, data?: any) {
        if (this.cbs.has(id)) {
            const callbacks = this.cbs.get(id)!
            for (const cb of callbacks) {
                cb(data)
            }
        }
    }

    remove(id: number) {
        this.cbs.delete(id)
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