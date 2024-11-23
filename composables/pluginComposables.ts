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


export function useDelay(callback: () => void, delay: number, detached = false) {
    const { $frameFactory } = useNuxtApp()

    const scope = useCleanScope(() => {
        const d = $frameFactory.Delay({
            callback: () => {
                scope.run(() => {
                    callback()
                })
            }, delay
        })

        d.run()

        return () => {
            d.stop()
            scope.stop()
        }
    }, detached)
    return scope
}

export function getFrame(callback: (arg: FrameEvent) => void, priority: FramePriority = FramePriority.MAIN) {
    const { $frameFactory } = useNuxtApp()

    return $frameFactory.Frame({ callback, priority })
}

// export function useROR(callback: (arg: ResizeEvent) => void) {
//     const { $ROR } = useNuxtApp()
//     return new $ROR(callback)
// }