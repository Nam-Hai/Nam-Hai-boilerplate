export function loadTexture(texture: any, src: string) {
    const image = new Image()
    image.src = src
    image.crossOrigin = 'anonymous'
    image.onload = () => {
        texture.image = image
    }
}

let id = 0
export function getUId() {
    id++
    const uId = [
        Math.floor(id % 256) / 256,
        Math.floor((id % (256 * 256)) / (256)) / 256,
        Math.floor((id % (256 * 256 * 256)) / (256 * 256)),
        Math.floor((id % (256 * 256 * 256 * 256)) / (256 * 256 * 256))
    ]
    return {id, uId}
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