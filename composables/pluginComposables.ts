import type { EffectScope } from "vue"
import { FramePriority, type FrameEvent } from "~/plugins/core/frame"
import type { StopMotionOption } from "~/plugins/core/stopMotion"

export function getFilm() {
    const { $motionFactory } = useNuxtApp()
    return $motionFactory.Film()
}


export function getMotion(arg: StopMotionOption) {
    const { $motionFactory } = useNuxtApp()
    return $motionFactory.Motion(arg)
}


export function getTimer(callback: () => void, delay: number) {
    const { $frameFactory } = useNuxtApp()
    return $frameFactory.Timer({ callback, delay })
}

export function getDelay(callback: () => void, delay: number) {
    const { $frameFactory } = useNuxtApp()

    return $frameFactory.Delay({ callback, delay })
}

export function useTimer() {

}

/**
 *  The delay created and its callback are scoped
 *  If scope is destroyed before the delay, the callback is never called.
 *  If scope is destroyed after the delay, the callback's scoped is cleanedup 
 * 
 *  @example
 *  ```js
 *  onMounted(() => {
 *      useDelay(() => {
 *          useFrame(()=>{
 *              console.log('test');
 *          })
 *      }, 1000)
 *  })
 *  ```
 *  
 */
export function useDelay(callback: () => void, delay: number, detached = false) {
    const scope = useCleanScope(() => {
        let delayedScope: EffectScope | undefined;
        const d = getDelay(() => {

            delayedScope = useCleanScope(() => {
                return callback()
            }, true)

        }, delay).run()

        onScopeDispose(() => {
            delayedScope?.stop()
            d.stop()
        })
        return d
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

        onScopeDispose(() => {
            raf.kill()
        })
        return raf
    })
}


export function useMotion(arg: StopMotionOption) {
    const motion = getMotion(arg)
    const scope = useCleanScope(() => {
        return () => {
            motion.pause()
        }
    })
    return [motion, scope]
}

export function useFilm() {

    const film = getFilm()
    const scope = useCleanScope(() => {
        return () => {
            film.pause()
        }
    })
    return [film, scope]
}