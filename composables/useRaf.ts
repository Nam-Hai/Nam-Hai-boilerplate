import { FramePriority, type FrameEvent } from "~/plugins/core/frame"

export const useRaf = (cb: (e: FrameEvent) => void, priority: FramePriority = FramePriority.MAIN) => {

  return useCleanScope(() => {
    console.log('callback in useSafeClient');
    const raf = getFrame(cb, priority).run()

    return () => {
      raf.kill()
    }
  })
}
