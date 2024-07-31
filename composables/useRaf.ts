import { type rafEvent, RafPriority } from "~/plugins/core/raf"

export const useRaf = (cb: (e: rafEvent) => void, priority: RafPriority = RafPriority.NORMAL) => {

  const { $RafR } = useNuxtApp()
  const raf = process.client ? new $RafR(cb, priority) : undefined

  onMounted(() => {
    raf && raf.run()
  })

  onBeforeUnmount(() => {
    raf && raf.kill()
  })

  return raf
}
