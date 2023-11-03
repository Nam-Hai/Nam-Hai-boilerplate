import { Ease, Ease4 } from "~/plugins/core/eases";
import { Arr, BM, Clamp, Cr, Ga, Has, Is, Lerp, O, PD, PE, Rand, Round, Select, Snif, T, ZL, get, getAll, iLerp, map, random, Svg, Class } from "~/plugins/core/utils";

export const mod = (n: number, m: number) => (n % m + m) % m;

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
  Svg,
  Class
}