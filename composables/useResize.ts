import { ROR } from "~/plugins/core/resize";

export const useResize = (callback?: (e: { vh: number, vw: number, scale: number, breakpoint: string }) => void) => {
  const { $ROR } = useNuxtApp()
  const ro = ref() as Ref<ROR>

  const vh = ref(0)
  const vw = ref(0)
  const scale = ref(0)
  const breakpoint = ref('')
  const updateData = (e: { vh: number, vw: number, scale: number, breakpoint: string }) => {
    vh.value = e.vh
    vw.value = e.vw
    scale.value = e.scale
    breakpoint.value = e.breakpoint
  }

  onMounted(() => {
    ro.value = new $ROR((e) => {
      updateData(e)
      callback && callback(e)
    })
    ro.value.on()
  });

  onBeforeUnmount(() => {
    ro.value.off()
  });
  return { vh, vw, scale, breakpoint }
}
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
export function useCanvasSize(callback?: (size: { width: number, height: number }) => void) {
  const { $canvas } = useNuxtApp()

  const unWatch = watch($canvas.size, (size) => {
    callback && callback(size)
  }, {immediate: true})

  return { canvasSize: $canvas.size, unWatch }
}
