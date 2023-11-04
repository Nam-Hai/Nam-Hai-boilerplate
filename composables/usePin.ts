import { onFlow } from "~/waterflow/composables/onFlow"

type usePinOptions = {
  el: Ref<HTMLElement>,
  start?: number,
  end?: number,
  endPx?: number,
  eStart?: number,
  onEnter?: () => void,
  onProgress?: (t: number) => void,
  direction?: "vertical" | "horizontal"
}

export const usePin = ({
  el,
  start = 0,
  end = Infinity,
  endPx = 0,
  eStart = 0,
  onEnter = () => { },
  onProgress = (t: number) => { },
  direction = "vertical"
}: usePinOptions) => {

  let on = false
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
    computeBounds()
  }


  function computeBounds() {
    let boundsRect = el.value.getBoundingClientRect()
    bounds.height = direction == 'vertical' ? boundsRect.height : boundsRect.width
    bounds.y = direction == 'vertical' ? boundsRect.top + scrollY : boundsRect.left + scrollX;
    on = true
  }

  const progress = ref(0)
  const raf = useRaf(() => {
    if (!on) return
    const screenSize = direction == "vertical" ? vh.value : vw.value
    const scroll = direction == "vertical" ? scrollY : scrollX
    const dist = scroll - bounds.y + start * screenSize / 100 - bounds.height * eStart / 100
    let offset = N.Clamp(dist, 0, end * screenSize / 100 + endPx)
    if (offset > 0) hasEnter.value = true

    if (el.value) direction == "vertical" ? N.T(el.value, 0, offset, 'px') : N.T(el.value, offset, 0, 'px')

    const t = N.iLerp(offset, 0, end * screenSize / 100 + endPx)
    progress.value = t
    onProgress(t)

    on = false
  }, { lastStack: false })

  useLenisScroll((e) => {
    on = true
  })

  const { vh, vw } = useStore()
  useRO(resize)

  onMounted(() => {
    computeBounds()
  })
  onFlow(() => {
    computeBounds()
  })

  watch(hasEnter, () => {
    onEnter()
  })

  return { computeBounds, raf, progress }
}