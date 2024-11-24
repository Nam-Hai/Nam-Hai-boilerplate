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

const get = (selector: string, context?: ParentNode) => {
  const c = context || document;
  return c.querySelector(selector)
}
const getAll = (selector: string, context?: ParentNode) => {
  const c = context || document
  return c.querySelectorAll(selector)
}

const Is = {
  str: (t: any): t is string => 'string' == typeof t,
  obj: (t: any): t is Object => t === Object(t),
  arr: (t: any): t is Array<any> => t.constructor === Array,
  def: <T>(t: T | undefined): t is T => void 0 !== t,
  und: (t: any): t is undefined => t === undefined
}

const Select = (t: string | NodeList | HTMLElement[] | HTMLElement) => {
  return Is.str(t) ? getAll(t) : (t instanceof window.NodeList || Array.isArray(t)) ? t : [t];
}

const Cr = (tagName: string) => {
  return document.createElement(tagName)
}

const Round = (x: number, decimal?: number) => {
  decimal = Is.und(decimal) ? 100 : 10 ** decimal;
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
  /** shuffle an Array */
  shuffle: <T>(array: Array<T>) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = ~~(random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }
}

const Has = <T extends Object, K extends PropertyKey>(obj: T, property: K): obj is Extract<T, { [P in K]?: any }> => obj.hasOwnProperty(property)

const O = (el: HTMLElement, value: string | number) => {
  el.style.opacity = "" + value
}

const pe = (el: HTMLElement, state: string) => {
  el.style.pointerEvents = state
}
const PE = {
  all: (el: HTMLElement) => {
    pe(el, 'all')
  },
  none: (el: HTMLElement) => {
    pe(el, 'none')
  }
}

const Snif = {
  isMobile: () => {
    return window.matchMedia('(pointer: coarse)').matches;
  },
  isTouchable: () => {
    return window.matchMedia('(any-pointer: coarse)').matches;
  }
}

const T = (el: HTMLElement, x: number, y: number, unit: string = "%") => {
  el.style.transform = "translate3d(" + x + unit + "," + y + unit + ",0)"
}
const BM = (context: any, methodArray: string[]) => {
  for (const methodString of methodArray) {
    context[methodString] = context[methodString].bind(context)
  }
}

const Ga = (context: Element, attribute: string) => context.getAttribute(attribute)
const PD = (event: Event) => {
  event.cancelable && event.preventDefault()
}
const ZL = (t: number) => 9 < t ? '' + t : '0' + t

const Class = {
  add: (el: Element, name: string) => {
    el.classList.add(name)
  },
  remove: (el: Element, name: string) => {
    el.classList.remove(name)
  },
  toggle: (el: Element, name: string) => {
    el.classList.toggle(name)
  }
}
export class OrderedMap<K extends number, V> extends Map<number, V> {
  orderedKeys: K[];
  constructor() {
    super()

    this.orderedKeys = []
  }

  override set(key: K, value: V) {
    if (!this.has(key)) {
      this.orderedKeys.push(key)
      this.orderedKeys.sort((a, b) => { return a - b })
    }
    super.set(key, value)

    return this
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
  binarySearch,
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
  Class
}