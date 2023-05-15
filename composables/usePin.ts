import { useResize } from "./useResize"

type usePinOptions = {
  el: Ref<HTMLElement>,
  start?: number,
  end?: number,
  eStart?: number,
  onEnter?: () => void,
  onProgress?: (t: number) => void,
}

export const usePin = ({
  el,
  start = 0,
  end = Infinity,
  eStart = 0,
  onEnter = () => { },
  onProgress = (t: number) => { },
}: usePinOptions) => {

  const hasEnter = ref(false)
  const bounds = reactive({
    y: 0,
    height: 0
  })

  const resize = () => {
    N.T(el.value, 0, 0, 'px')
    let boundsRect = el.value.getBoundingClientRect()
    bounds.y = boundsRect.top + window.scrollY
    bounds.height = boundsRect.height
  }

  onMounted(() => {
    let boundsRect = el.value.getBoundingClientRect()
    bounds.y = boundsRect.top + window.scrollY
    bounds.height = boundsRect.height
  })

  useLenisScroll((e) => {
    const dist = window.scrollY - bounds.y + start * vh.value / 100 - bounds.height * eStart / 100
    let offset = N.Clamp(dist, 0, end * vh.value / 100)
    if (offset > 0) hasEnter.value = true

    N.T(el.value, 0, offset, 'px')

    const t = N.iLerp(offset, 0, end * vh.value / 100)
    onProgress(t)
  })

  const { vh } = useResize(resize)

  watch(hasEnter, () => {
    onEnter()
  })

}


// un petit bide
export function useSmoothPin({
  el,
  duration,
  force
}: {
  el: Ref<HTMLElement>,
  duration: number,
  force: number
}) {
  let bounds = reactive({
    y: 0,
    height: 0
  })

  const resize = () => {

    N.T(el.value, 0, 0, 'px')
    let boundsRect = el.value.getBoundingClientRect()
    bounds.y = boundsRect.top + window.scrollY
    bounds.height = boundsRect.height
    bounds.y = boundsRect.top + window.scrollY - f / 2 * vh.value
    lenis.emit()
  }

  const { vh } = useResize(resize)

  onMounted(() => {
    intersectionInit()
    el.value.style.marginBottom = duration + 'vh'
    el.value.style.marginTop = force / 2 + 'vh'
    let boundsRect = el.value.getBoundingClientRect()
    bounds.y = boundsRect.top + window.scrollY - f / 2 * vh.value
    bounds.height = boundsRect.height

  })

  const d = duration / 100
  const f = force / 100
  const { lenis } = useLenisScroll((e) => {
    const dist = window.scrollY - bounds.y
    let offset = N.Clamp(dist, 0, (d + f / 2) * vh.value)

    const smoothIn = N.Clamp(N.iLerp(offset, 0, f / 2 * vh.value), 0, 1)
    N.T(el.value, 0, offset - N.Ease.io2(smoothIn) * f / 2 * vh.value, 'px')

    if (smoothIn != 1) return
    N.T(el.value, 0, offset - vh.value * f / 2, 'px')


    const smoothOut = N.Clamp(N.iLerp(dist, (d + f / 2) * vh.value, (d + f) * vh.value), 0, 1)
    if (smoothOut == 0) return
    console.log('test', offset, smoothOut);
    N.T(el.value, 0, (d - N.Ease.io2(smoothOut) * f / 2) * vh.value, 'px')
    el.value.style.marginBottom = N.Ease.i2(1 - smoothOut) * f * vh.value + 'px'
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
}