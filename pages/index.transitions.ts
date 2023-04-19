import { transtionFunction } from "~/composables/usePageTransition"
import Canvas from '@/scene/canvas.js';

export type IndexTransitionProps = {
  wrapperRef: Ref<HTMLElement>,
}

const transitionIndexOutDefault = ({ wrapperRef }: IndexTransitionProps, resolve: () => void, canvas: Ref<Canvas>) => {
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
      console.log('RESOLVE')
      resolve()
    }
  }).from({
    d: 2000,
    e: 'io4',
    update: (e) => {
      canvas.value.mesh.rotation.z = e.progE * Math.PI 
      canvas.value.mesh.rotation.y = e.progE * Math.PI / 4
    }
  }).play()
}


export const IndexTransitionMap = new Map([
  ['default', transitionIndexOutDefault]
])
