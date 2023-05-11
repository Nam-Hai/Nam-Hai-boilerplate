import { Motion, TL } from './core/motion'
import { RafR, Delay, Timer } from './core/raf'
import { ROR } from './core/resize'
import { Ease, Ease4 } from '../plugins/core/eases'
import { Is, Snif, Lerp, iLerp, Round, Clamp, map, get, getAll, Select, Cr, random, Rand, Arr, Has, O, T, PE, BM, Ga, PD, ZL, Svg } from './core/utils'

export const N = {
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
  Delay,
  Timer,
  RafR,
  Motion,
  TL,
  ROR,
}

export default defineNuxtPlugin(nuxtApp => {
  const N = {
    Delay,
    Timer,
    RafR,
    Motion,
    TL,
    ROR,
  }

  return {
    provide: {
      ...N,
    }
  }

})
