// import { Camera, Renderer } from "ogl";
// import { shallowRef, type ShallowRef } from "vue";

import { Camera, Renderer, type OGLRenderingContext } from "ogl"

// export function createContext<T>() {
//     let store: T;
//     const provider = (s: () => T) => {
//         store = s()
//     }
//     const inject = (): T => {
//         return store
//     }

//     return [provider, inject]
// }

// export function createContextV1<T, Args extends any[] | [any]>(providerSchema: (...args: Args) => T) {
//     // let store = shallowRef() as ShallowRef<T>;
//     let store: T;

//     const provider = (...args: Args) => {
//         // store.value = providerSchema(...args)
//         store = providerSchema(...args)
//     }
//     function inject(): T {
//         // return store.value
//         return store
//     }

//     return [provider, inject] as const
// }

// const provider = (canvas: HTMLCanvasElement) => {
//     const renderer = new Renderer({ canvas, alpha: true })
//     const gl = renderer.gl

//     return {
//         renderer,
//         gl
//     }
// }


// export const [provideOGL, useOGL] = createContextV1(provider)
// export const [provideCamera, useCamera] = createContextV1((cam: Camera) => {
//     const camera = shallowRef(cam)

//     return {
//         camera
//     }
// })

export type OGLContext = {
    gl: OGLRenderingContext,
    renderer: Renderer
    testRef: Ref<number>
}
export const provideOGL = (canvas: HTMLCanvasElement): OGLContext => {

    const renderer = new Renderer({ canvas, alpha: true })
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

// export const [provideOGL, useOGL] = createContext((canvas?: HTMLCanvasElement) => {

//     const renderer = new Renderer({ canvas, alpha: true })
//     const gl = renderer.gl
//     return {
//         gl,
//         renderer

//     }
// })

export const [provideCamera, useCamera] = createContext("camera", (cam: Camera) => {
    const camera = shallowRef(cam)

    return {
        camera
    }
})