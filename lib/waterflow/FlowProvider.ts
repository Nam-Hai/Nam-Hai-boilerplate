import type { ShallowRef } from "vue";



type CrossFadeMode = "TOP" | "BOTTOM"
export const [provideFlowProvider, useFlowProvider, flowKey] = createContext(() => {
  const route = useRoute()
  const currentRoute = shallowRef(route)
  const routeTo = shallowRef(route)
  const routeFrom = shallowRef(route)

  const crossfadeMode: ShallowRef<CrossFadeMode> = shallowRef("TOP")

  const flowIsHijackedPromise: Promise<void>[] = shallowReactive([])
  const flowIsHijacked = computed(() => {
    return flowIsHijackedPromise.length !== 0
  })

  function hijackFlow() {
    let resolver: () => void = () => { }
    const promise = new Promise<void>((resolve) => {
      resolver = () => {
        resolve;
        flowIsHijackedPromise.pop()
      }
    });
    flowIsHijackedPromise.unshift(promise)

    return resolver
  }

  const flowInPromise: Array<{ promise: Promise<void>, blocking: boolean }> = shallowReactive([])
  function startFlowIn(blocking: boolean = false) {
    let resolver: () => void = () => { }

    flowInPromise.unshift({
      promise: new Promise<void>((resolve) => {
        resolver = () => {
          flowInPromise.pop()
          resolve();
        }
      }),
      blocking
    });

    return resolver
  }

  watch(currentRoute, (newVal, oldVal) => {
    routeTo.value = newVal
    routeFrom.value = oldVal
  })

  return {
    currentRoute: currentRoute,
    routeTo: shallowReadonly(routeTo),
    routeFrom: shallowReadonly(routeFrom),

    crossfadeMode,

    flowIsHijackedPromise: shallowReadonly(flowIsHijackedPromise),
    flowIsHijacked: shallowReadonly(flowIsHijacked),
    hijackFlow,

    flowInPromise: shallowReadonly(flowInPromise),
    startFlowIn,
  }
});
