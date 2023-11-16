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
        Math.floor(id % 256) / 256,
        Math.floor((id % (256 * 256)) / (256)) / 256,
        Math.floor((id % (256 * 256 * 256)) / (256 * 256)),
        Math.floor((id % (256 * 256 * 256 * 256)) / (256 * 256 * 256))
    ]
    return { id, uId }
}


import { Transform, RenderTarget, Mesh, Camera, Program, Geometry, Plane, Sphere } from 'ogl'

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
    callbacks: { [key: string]: ((e?: any) => void)[] }
    constructor() {
        this.callbacks = {}
    }

    on(event: string, cb: (e: any) => void) {
        if (!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb)
    }

    emit(event: string, data?: any) {
        const callbacks = this.callbacks[event]
        if (!callbacks) return
        for (const cb of callbacks) {
            cb(data)
        }
    }
}