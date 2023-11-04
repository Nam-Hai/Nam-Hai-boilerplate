import { RafR, rafEvent } from "../plugins/core/raf";

export const useRaf = (cb: (e: rafEvent) => void, options: { lastStack?: boolean, firstStack?: boolean } = { lastStack: false, firstStack: false }) => {

  const { $RafR } = useNuxtApp()
  const raf = new $RafR(cb, options.lastStack, options.firstStack)

  onMounted(() => {
    raf.run()
  })

  onBeforeUnmount(() => {
    raf.kill()
  })

  return raf
}
