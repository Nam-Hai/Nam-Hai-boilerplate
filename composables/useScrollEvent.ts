import { useResize } from "./useResize"

type useScrollEventOptions = {
  el: Ref<HTMLElement>,
  vStart?: number,
  eStart?: number,
  vEnd?: number,
  eEnd?: number,
  onEnter?: () => void,
  onProgress?: (t: number) => void,
  pin?: boolean
}

export const useScrollEvent = ({
  el,
  vStart = 100,
  eStart = 0,
  vEnd = 0,
  eEnd = 100,
  onEnter = undefined,
  onProgress = undefined
}: useScrollEventOptions) => {
  const hasEnter = ref(false)
  const bounds = ref() as Ref<DOMRect>


  const resize = () => {
    bounds.value = el.value.getBoundingClientRect()
    bounds.value.y = bounds.value.top + window.scrollY

  }

  const { vh, vw } = useResize(resize)

  onMounted(() => {
    intersectionInit()
    bounds.value = el.value.getBoundingClientRect()
    bounds.value.y = bounds.value.top + window.scrollY
  })

  const { lenis } = useLenisScroll(() => {
    const dist = window.scrollY - bounds.value.y + vh.value * vStart / 100 - bounds.value.height * eStart / 100
    const max = bounds.value.height * (eEnd - eStart) / 100 + vh.value * (vStart - vEnd) / 100
    const offset = N.Clamp(dist, 0, max)
    const t = offset / max
    if (t > 0 && !hasEnter.value) {
      hasEnter.value = true
      onEnter && onEnter()

      if (!onProgress) {
        intersectionObserver.value.disconnect()
        lenis.stop()
      }
    }
    onProgress && onProgress(t)
  })

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
}

