import { transitionFunction } from "~/composables/usePageTransition"
import { N } from "~/helpers/namhai-utils"

export type IndexTransitionProps = {
  wrapperRef: Ref<HTMLElement>,
}

const transitionIndexOutDefault: transitionFunction<IndexTransitionProps> = ({ wrapperRef }, { canvas }, resolve) => {
  const { $TL } = useNuxtApp()
  let fromRotation = [canvas.value.mesh.rotation.z, canvas.value.mesh.rotation.y]
  let toRotation = [Math.PI * 2 * Math.random(), Math.PI /2 * Math.random()]
  let tl = new $TL()
  tl.from({
    el: wrapperRef.value,
    d: 1000,
    e: 'io2',
    p: {
      x: [0, -100]
    },
    cb: () => {
      resolve()
    }
  }).from({
    d: 2000,
    e: 'io4',
    update: (e) => {
      if (!canvas) return
      canvas.value.mesh.rotation.z = N.Lerp(fromRotation[0], toRotation[0], e.progE)
      canvas.value.mesh.rotation.y = N.Lerp(fromRotation[1], toRotation[1], e.progE)
    }
  }).play()
}


export const IndexTransitionOutMap = new Map([
  ['default', transitionIndexOutDefault]
])

const transitionIndexCrossfadeInDefault: transitionFunction<IndexTransitionProps> = ({ wrapperRef }, { canvas }, resolve) => {
  const { $TL } = useNuxtApp()
  let tl = new $TL()
  console.log(wrapperRef.value)
  tl.from({
    el: wrapperRef.value,
    d: 300,
    e: 'io2',
    p: {
      o: [0, 1]
    },
    cb: () => {
      resolve()
    }
  }).play()
}

export const IndexTransitionCrossfadeMap = new Map([
  ['default', transitionIndexCrossfadeInDefault]
])
