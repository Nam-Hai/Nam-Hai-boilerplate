import { FramePriority, type FrameEvent } from "~/plugins/core/frame"

export const useRaf = (cb: (e: FrameEvent) => void, priority: FramePriority = FramePriority.MAIN) => {

  const { $Frame } = useNuxtApp()
  console.log($Frame);
  const raf = process.client ? new $Frame(cb, priority) : undefined
  console.log(raf);

  onMounted(() => {
    raf && raf.run()
  })

  onBeforeUnmount(() => {
    raf && raf.kill()
  })

  return raf
}
