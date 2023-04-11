import { Ease, Ease4 } from './core/eases'
import { Is, Snif, Lerp, iLerp, Round, Clamp, map, get, getAll, Select, Cr, random, Rand, Arr, Has, O, T, PE, BM, Ga, PD, ZL, Svg } from './core/utils'
import { Motion, TL } from './core/motion'
import { Raf, RafR,  Delay} from './core/raf'

export default defineNuxtPlugin(nuxtApp =>{
  const N = {
    Svg,
    Lerp,
    iLerp,
    Clamp,
    map,
    get,
    getAll,
    Select,
    Cr,
    Round,
    random,
    Rand,
    Arr,
    Has,
    O,
    T,
    PE,
    Snif,
    BM,
    Ga,
    PD,
    ZL,
    Ease,
    Ease4,
    Is,
    // Tab,
    Delay,
    Raf,
    RafR,
    Motion,
    TL,
    // Timer
  }

  return {
    provide: {
      ...N
    }
  }

})