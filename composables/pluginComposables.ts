import { MotionArg } from "~/plugins/core/motion"
import { rafEvent } from "~/plugins/core/raf"
import { ResizeEvent } from "~/plugins/core/resize"

export function useManifest() {
    const { $manifest } = useNuxtApp()
    return $manifest
}

export function useLenis() {
    const { lenis } = useStore()
    return lenis.value
}

export function useCanvas() {
    const { $canvas } = useNuxtApp()
    return $canvas
}

export function useTL() {
    const { $TL } = useNuxtApp()
    return new $TL
}
export function useTimer(callback: () => void, delay: number) {
    const { $Timer } = useNuxtApp()
    return new $Timer(callback, delay)
}

export function useMotion(arg: MotionArg) {
    const { $Motion } = useNuxtApp()
    return new $Motion(arg)
}

export function useDelay(delay: number, callback: () => void, options?: { immediate?: boolean }) {
    const { $Delay } = useNuxtApp()
    return new $Delay(callback, delay)
}

export function useRafR(callback: (arg: rafEvent) => void, options?: { lastStack?: boolean, firstStack?: boolean }) {
    const { $RafR } = useNuxtApp()
    return new $RafR(callback, options?.lastStack, options?.firstStack)
}

export function useROR(callback: (arg: ResizeEvent) => void) {
    const { $ROR } = useNuxtApp()
    return new $ROR(callback)
}