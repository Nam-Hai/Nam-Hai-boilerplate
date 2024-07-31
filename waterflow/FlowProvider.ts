import type { RouteLocationNormalized } from '#vue-router';
import type { ShallowRef } from 'nuxt/dist/app/compat/capi';
import { createContext } from './util/apiInject';


type CrossFadeMode = "TOP" | "BOTTOM"
export const [provideFlowProvider, useFlowProvider] = createContext(() => {
  const route = useRoute()
  const currentRoute = shallowRef(route)
  const routeTo = shallowRef(route)
  const routeFrom = shallowRef(route)
  const crossfadeMode: ShallowRef<CrossFadeMode> = shallowRef("TOP")


  const flowIsHijacked = shallowRef(false)
  let flowHijackResolver: (() => void) | undefined

  function releaseHijackFlow() {
    if (!flowHijackResolver) return
    flowHijackResolver()
    flowIsHijacked.value = false
    flowHijackResolver = undefined
  }

  function hijackFlow() {
    flowIsHijacked.value = true
    return new Promise<void>((resolve) => {
      flowHijackResolver = resolve;
    });
  }

  return {
    currentRoute,
    routeTo,
    routeFrom,
    crossfadeMode,

    flowIsHijacked,

    hijackFlow,
    releaseHijackFlow
  }
});
