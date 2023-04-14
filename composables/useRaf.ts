import { RafR, rafCbType } from "../plugins/core/raf";

export const useRaf = (cb: (e: rafCbType) => void) => {
  const { $RafR } = useNuxtApp()

  // const raf = new $RafR(cb)
  const raf = ref() as Ref<RafR>

  onMounted(() => {
    raf.value = new $RafR(cb)
    raf.value.run()
  })

  onBeforeUnmount(() => {
    raf.value.stop()
  })

  return {
    raf
  }
}
