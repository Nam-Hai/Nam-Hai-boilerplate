import type { RouteLocationNormalized } from '#vue-router';
import { createContext } from './util/apiInject';


export const [provideFlowProvider, useFlowProvider] = createContext(() => {
  const currentRoute = shallowRef(useRoute())

  const flowIsHijacked = shallowRef(false)

  return {
    currentRoute,
    flowIsHijacked
  }
});
