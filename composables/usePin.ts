import { N } from "~/helpers/namhai-utils"
import { useResize } from "./useResize"

type usePinOptions = {
  el: Ref<HTMLElement>,
  start?: number,
  end?: number,
  eStart?: number,
  onEnter?: () => void,
  onProgress?: (t: number) => void
}

export const usePin = ({
  el,
  start = 0,
  end = Infinity,
  eStart = 0,
  onEnter = () => { },
  onProgress = (t: number) => { }
}: usePinOptions) => {

  const hasEnter = ref(false)
  const offset = ref(0)
  const bounds = reactive({
    y: 0,
    height: 0
  })

  const resize = () => {

    N.T(el.value, 0, 0, 'px')
    let boundsRect = el.value.getBoundingClientRect()
    bounds.y = boundsRect.top + window.scrollY
  }

  onMounted(() => {
    console.log(el, el.value);
    let boundsRect = el.value.getBoundingClientRect()
    bounds.y = boundsRect.top + window.scrollY
  })

  useLenisScroll((e) => {
    const dist = window.scrollY - bounds.y + start * vh.value / 100 - bounds.height * eStart / 100
    offset.value = N.Clamp(dist, 0, end * vh.value / 100)
    if (offset.value > 0) hasEnter.value = true
    N.T(el.value, 0, offset.value, 'px')

    // t [0:1]
    onProgress(N.iLerp(offset.value, 0, end * vh.value / 100))
  })

  const { vh } = useResize(resize)

  watch(hasEnter, () => {
    onEnter()
  })

}
