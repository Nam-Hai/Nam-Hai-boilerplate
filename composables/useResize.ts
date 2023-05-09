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

// TODO use a store ?
export function useCanvasSize(callback?: (size: {width:number, height: number})=> void): Ref<{height:number, width:number}>{
  const { $canvas } = useNuxtApp()

  watch($canvas.size, size => {
    callback && callback(size)
  })

  return $canvas.size
}
