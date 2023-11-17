import type { MotionArg } from "~/plugins/core/motion"
import { RafPriority, type rafEvent } from "~/plugins/core/raf"
import type { ResizeEvent } from "~/plugins/core/resize"

export function useManifest() {
    const { $manifest } = useNuxtApp()
    return $manifest
}

export function useLenis() {
    const { lenis } = useStoreView()
    return lenis.value
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
    const d = new $Delay(callback, delay)
    d.run()
    return d
}

export function useRafR(callback: (arg: rafEvent) => void, priority: RafPriority = RafPriority.NORMAL) {
    const { $RafR } = useNuxtApp()
    return new $RafR(callback, priority)
}

export function useROR(callback: (arg: ResizeEvent) => void) {
    const { $ROR } = useNuxtApp()
    return new $ROR(callback)
}