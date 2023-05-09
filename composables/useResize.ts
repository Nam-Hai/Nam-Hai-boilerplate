import { ROR } from "~/plugins/core/resize";

export function useRO(callback: (e: { vh: number, vw: number, scale: number, breakpoint: string }) => void) {
  const { $ROR } = useNuxtApp()
  const ro = ref() as Ref<ROR>

  onMounted(() => {
    ro.value = new $ROR(callback)
    ro.value.on()
  });

  onBeforeUnmount(() => {
    ro.value.off()
  });

  return ro.value;
}


