import { FramePriority, type FrameEvent } from "~/plugins/core/frame"
import type { ResizeEvent } from "~/plugins/core/resize"
import type { StopMotionOption } from "~/plugins/core/stopMotion"

export function useManifest() {
    const { $manifest } = useNuxtApp()
    return $manifest
}

export function useLenis() {
    // const { lenis } = useStoreView()
    // return lenis.value
    return {}
}

export function useFilm() {
    const { $Film } = useNuxtApp()
    return new $Film
}
export function useTimer(callback: () => void, delay: number) {
    const { $Timer } = useNuxtApp()
    return new $Timer(callback, delay)
}

export function useMotion(arg: StopMotionOption) {
    const { $Motion } = useNuxtApp()
    return new $Motion(arg)
}

export function useDelay(delay: number, callback: () => void, options?: { immediate?: boolean }) {
    const { $Delay } = useNuxtApp()
    const d = new $Delay(delay, callback)
    d.run()
    return d
}

export function useFrame(callback: (arg: FrameEvent) => void, priority: FramePriority = FramePriority.MAIN) {
    const { $Frame } = useNuxtApp()
    return new $Frame(callback, priority)
}

export function useROR(callback: (arg: ResizeEvent) => void) {
    const { $ROR } = useNuxtApp()
    return new $ROR(callback)
}