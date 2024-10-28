import { Camera, Renderer, type OGLRenderingContext } from "ogl"

export type OGLContext = {
    gl: OGLRenderingContext,
    renderer: Renderer
    testRef: Ref<number>
}
export const provideOGL = (canvas: HTMLCanvasElement): OGLContext => {

    const renderer = new Renderer({ canvas, alpha: true, width: innerWidth, height: innerHeight, dpr: devicePixelRatio })
    const gl = renderer.gl
    const testRef = shallowRef(0)
    const context = {
        renderer,
        gl,
        testRef
    }
    provide("ogl", context)

    return context
}
export const useOGL = () => {
    return inject("ogl") as OGLContext
}

export const [provideCamera, useCamera] = createContext((cam: Camera) => {
    const camera = shallowRef(cam)

    return {
        camera
    }
})