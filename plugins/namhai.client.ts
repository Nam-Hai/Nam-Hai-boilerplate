import { Motion, TL } from './core/motion'
import { RafR, Delay, Timer } from './core/raf'
import { ROR } from './core/resize'

const N = {
  Delay,
  Timer,
  RafR,
  Motion,
  TL,
  ROR,
}

export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      ...N,
    }
  }

})
