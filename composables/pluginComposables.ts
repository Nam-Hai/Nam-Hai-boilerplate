import type { EffectScope } from "vue"
import { FramePriority, type FrameEvent } from "~/plugins/core/frame"
import type { StopMotionOption } from "~/plugins/core/stopMotion"

export function useFilm() {
    const { $motionFactory } = useNuxtApp()
    return $motionFactory.Film()
}

export function useMotion(arg: StopMotionOption) {
    const { $motionFactory } = useNuxtApp()
    return useCleanScope(() => {
        const motion = $motionFactory.Motion(arg)
        return () => {
            motion.pause()
        }
    })
}

export function useTimer(callback: () => void, delay: number) {
    const { $frameFactory } = useNuxtApp()
    return $frameFactory.Timer({ callback, delay })
}

export function getDelay(callback: () => void, delay: number) {
    const { $frameFactory } = useNuxtApp()

    return $frameFactory.Delay({ callback, delay })
}

export function useDelay(callback: () => void, delay: number, detached = false) {
    const scope = useCleanScope(() => {
        let delayedScope: EffectScope | undefined;
        const d = getDelay(() => {
            delayedScope = useCleanScope(() => {
                callback()
            }, true)
        }, delay).run()

        return () => {
            delayedScope?.stop()
            d.stop()
        }
    }, detached)

    return scope
}

export function getFrame(callback: (arg: FrameEvent) => void, priority: FramePriority = FramePriority.MAIN) {
    const { $frameFactory } = useNuxtApp()
    return $frameFactory.Frame({ callback, priority })
}
export const useFrame = (cb: (e: FrameEvent) => void, priority: FramePriority = FramePriority.MAIN) => {
    return useCleanScope(() => {
        const raf = getFrame(cb, priority).run()

        return () => {
            raf.kill()
        }
    })
}
