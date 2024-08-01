import { Frame } from './core/frame'
import { Motion, TL } from './core/motion'
import { RafR, Delay, Timer } from './core/raf'
import { ROR } from './core/resize'
import { StopMotion } from './core/stopMotion'

const N = {
  Delay,
  Timer,
  RafR,
  Motion,
  TL,
  ROR,
  Frame,
  StopMotion
}

export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      ...N,
    }
  }

})
