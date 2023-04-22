import { Motion, TL } from './core/motion'
import { RafR,  Delay} from './core/raf'
import { ROR } from './core/resize'


export default defineNuxtPlugin(nuxtApp =>{
  const N = {
    Delay,
    RafR,
    Motion,
    TL,
    ROR
  }

  return {
    provide: {
      ...N,
    }
  }

})