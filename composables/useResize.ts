export function useRO(callback: (e: { vh: number, vw: number, scale: number, breakpoint: string }) => void, triggerCb?: () => void) {
  const { $ROR } = useNuxtApp()
  const ro = new $ROR(callback, triggerCb)

  onMounted(() => {
    ro.on()
  });

  onBeforeUnmount(() => {
    ro.off()
  });



  return ro;
}

// TODO use a store ?
export function useCanvasSize(callback?: (size: { width: number, height: number }) => void) {
  const canvas = useCanvas()

  const unWatch = watch(canvas.size, (size) => {
    callback && callback(size)
  }, { immediate: true })

  return { canvasSize: canvas.size, unWatch }
}

export function useBounds(el: Ref<HTMLElement>): Ref<DOMRect> {
  const bounds = ref()
  useRO(() => {
    bounds.value = el.value.getBoundingClientRect()
  })

  return bounds
}
