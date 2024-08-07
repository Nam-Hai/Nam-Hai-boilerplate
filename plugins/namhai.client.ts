import { Delay, Frame, Timer } from './core/frame'
import { ROR } from './core/resize'
import { Film, Motion } from './core/stopMotion'

const N = {
  Delay,
  Timer,
  Motion,
  Film,
  ROR,
  Frame,
}

export default defineNuxtPlugin(nuxtApp => {

  return {
    provide: {
      ...N,
    }
  }

})
