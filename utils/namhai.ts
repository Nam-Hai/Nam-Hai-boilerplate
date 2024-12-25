import { Ease, Ease4 } from "~/plugins/core/eases";

const Lerp = (xi: number, xf: number, t: number) => {
  return (1 - t) * xi + t * xf
}

const iLerp = (x: number, xi: number, xf: number) => {
  return (x - xi) / (xf - xi)
}

const Clamp = (x: number, min: number, max: number) => {
  return Math.max(Math.min(x, max), min)
}

const map = (x: number, start1: number, end1: number, start2: number, end2: number) => {
  return Lerp(start2, end2, iLerp(x, start1, end1))
}

const get = <T extends Element = HTMLElement>(selector: string, context?: ParentNode) => {
  const c = context || document;
  return c.querySelector<T>(selector)
}
const getAll = <T extends Element = HTMLElement>(selector: string, context?: ParentNode) => {
  const c = context || document
  return c.querySelectorAll<T>(selector)
}


const Round = (x: number, decimal?: number) => {
  decimal = decimal === undefined ? 100 : 10 ** decimal;
  return Math.round(x * decimal) / decimal
}
const random = Math.random
const Rand = {
  /** Rand.range avec par default step = 1% de la range */
  range: (min: number, max: number, step = (max - min) / 1000) => {
    return Round(Math.random() * (max - min) + min, step)
  },
}
const Arr = {
  /** Create an Array of n element */
  create: (ArrayLength: number) => {
    return [...Array(ArrayLength).keys()]
  },
  randomElement: <T>(array: Array<T>) => {
    return array[Rand.range(0, array.length - 1, 0)]
  },
  /** shuffle an Array */
  shuffle: <T>(array: Array<T>) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = ~~(random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }
}

const T = (el: HTMLElement, x: number, y: number, unit: string = "%") => {
  el.style.transform = "translate3d(" + x + unit + "," + y + unit + ",0)"
}

const Bind = (context: any, methodArray: string[]) => {
  for (const methodString of methodArray) {
    context[methodString] = context[methodString].bind(context)
  }
}

const DOM = {
  getA: (context: Element, attribute: string) => context.getAttribute(attribute),
  setA: (context: Element, attribute: string, value: string) => context.setAttribute(attribute, value),
}

const Digit = (t: number) => 9 < t ? '' + t : '0' + t

const Class = {
  add: (el: Element, name: string) => {
    el.classList.add(name)
  },
  remove: (el: Element, name: string) => {
    el.classList.remove(name)
  },
  toggle: (el: Element, name: string, force?: boolean) => {
    el.classList.toggle(name, force)
  }
}

function binarySearch(arr: { id: number }[], n: number): { index: number, miss: boolean } {
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    const mid = Math.floor((right - left) / 2) + left
    const m = arr[mid].id

    if (n === m) {
      return {
        index: mid,
        miss: false
      }
    } else if (n < m) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return {
    index: left,
    miss: true
  }
}

function isKeyOf<Key extends PropertyKey>(object: Record<Key, any>, key: PropertyKey): key is Key {
  return key in object;
}

const mod = (n: number, m: number) => (n % m + m) % m;


export const N = {
  Lerp,
  iLerp,
  Clamp,
  map,
  get,
  getAll,
  Round,
  binarySearch,
  random,
  isKeyOf,
  Rand,
  Arr,
  Bind,
  DOM,
  T,
  Digit,
  mod,
  Ease,
  Ease4,
  Class
}