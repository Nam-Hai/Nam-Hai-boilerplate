import { Motion, TL } from './core/motion'
import { Raf, RafR,  Delay} from './core/raf'

export default defineNuxtPlugin(nuxtApp =>{
  const N = {
    Delay,
    RafR,
    Motion,
    TL,
  }

  return {
    provide: {
      ...N
    }
  }

})