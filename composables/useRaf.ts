import { RafR, rafEvent } from "../plugins/core/raf";

export const useRaf = (cb: (e: rafEvent) => void, options: { lastStack?: boolean, firstStack?: boolean } = { lastStack: false, firstStack: false }) => {
  const { $RafR } = useNuxtApp()

  const raf = ref() as Ref<RafR>

  onBeforeMount(() => {
    raf.value = new $RafR(cb, options.lastStack, options.firstStack)
    raf.value.run()
  })

  onBeforeUnmount(() => {
    raf.value.stop()
  })

  return raf
}
