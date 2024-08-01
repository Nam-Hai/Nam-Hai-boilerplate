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


  const flowIsHijackedPromise: Ref<Promise<void> | undefined> = shallowRef(undefined)
  let flowHijackResolver: (() => void) | undefined

  function releaseHijackFlow() {
    if (!flowHijackResolver) return
    flowHijackResolver()
    flowIsHijackedPromise.value = undefined
    flowHijackResolver = undefined
  }

  function hijackFlow() {
    flowIsHijackedPromise.value = new Promise<void>((resolve) => {
      flowHijackResolver = resolve;
    });

    return flowIsHijackedPromise.value
  }

  const flowInPromise: Ref<Promise<void> | undefined> = shallowRef()
  function startFlowIn(): undefined | (() => void) {
    let resolver: ((() => void) | undefined) = undefined

    flowInPromise.value = new Promise<void>((resolve) => {
      resolver = resolve;
    });
    return resolver
  }

  return {
    currentRoute,
    routeTo,
    routeFrom,
    crossfadeMode,

    flowIsHijackedPromise,
    hijackFlow,
    releaseHijackFlow,

    flowInPromise,
    startFlowIn,
  }
});
