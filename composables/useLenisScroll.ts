export const useLenisScroll = (callback: (e: any) => void) => {
  const $lenis = useStore().lenis

  const onScrollSubscription = ref()
  onMounted(() => {
    onScrollSubscription.value = $lenis.value.on('scroll', callback)
  })
  onBeforeUnmount(() => {
    onScrollSubscription.value()
  })

  const on = () => {
    onScrollSubscription.value()
    onScrollSubscription.value = $lenis.value.on('scroll', callback)
  }
  const off = () => {
    onScrollSubscription.value()
  }

  return {
    lenis: {
      run: on,
      stop: off,
      on,
      off,
      emit: () => $lenis.value.emit(),
      onScrollSubscription
    }
  }
}
