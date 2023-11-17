import { RafPriority, type rafEvent } from "../plugins/core/raf";

export const useRaf = (cb: (e: rafEvent) => void, priority: RafPriority = RafPriority.NORMAL) => {

  const { $RafR } = useNuxtApp()
  const raf = new $RafR(cb, priority)

  onMounted(() => {
    raf.run()
  })

  onBeforeUnmount(() => {
    raf.kill()
  })

  return raf
}
