import { transitionFunction } from "~/composables/usePageTransition"
import { useFlowProvider } from "~/util/FlowProvider"

// const flow = useFlowProvider()
// console.log(flow)
export type IndexTransitionProps = {
  wrapperRef: Ref<HTMLElement>,
}

const transitionIndexOutDefault: transitionFunction<IndexTransitionProps> = ({ wrapperRef }, { canvas }, resolve) => {
  const { $TL } = useNuxtApp()
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
      canvas.value.mesh.rotation.z = e.progE * Math.PI
      canvas.value.mesh.rotation.y = e.progE * Math.PI / 4
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
    d: 1000,
    e: 'io2',
    p: {
      x: [100, 0]
    },
    cb: () => {
      resolve()
    }
  }).play()
}

export const IndexTransitionCrossfadeMap = new Map([
  ['default', transitionIndexCrossfadeInDefault]
])
