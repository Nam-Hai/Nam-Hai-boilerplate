import { N } from "~/helpers/namhai-utils"

type usePinOptions = {
  el: Ref<HTMLElement>,
  start?: number,
  end?: number,
  onEnter?: () => void
}

export const usePin = ({
  el,
  start = 0,
  end = Infinity,
  onEnter
}: usePinOptions) => {

  const hasEnter = ref(false)
  const bounds = ref() as Ref<DOMRect>
  const offset = ref(0)

  const resize = () => {

    N.T(el.value, 0, 0, 'px')
    bounds.value = el.value.getBoundingClientRect()
    bounds.value.y = bounds.value.top + window.scrollY

    intersectionObserver.value.disconnect()
    lenis.run()
    lenis.emit()
    intersectionInit()
  }

  onMounted(() => {
    intersectionInit()
    bounds.value = el.value.getBoundingClientRect()
    bounds.value.y = bounds.value.top + window.scrollY
  })

  const { lenis } = useLenisScroll((e) => {
    offset.value = N.Clamp(window.scrollY - bounds.value.y + start * vh.value / 100, 0, end)
    if (offset.value > 0) hasEnter.value = true

    N.T(el.value, 0, offset.value, 'px')
  })

  const { vh } = useResize(resize)

  const intersectionObserver = ref() as Ref<IntersectionObserver>
  const intersectionInit = () => {
    intersectionObserver.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.isIntersecting ? lenis.run() : lenis.stop()
      })
    })
    intersectionObserver.value.observe(el.value)
  }



  onBeforeUnmount(() => {
    intersectionObserver.value.disconnect()
  })

  watch(hasEnter, () => {
    onEnter && onEnter()
  })

}
