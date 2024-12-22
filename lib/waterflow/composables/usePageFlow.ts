import { EffectScope, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useFlowProvider } from "../FlowProvider";
import type { RouteLocationNormalized } from "#vue-router";
import { onLeave } from "./onFlow";

export type FlowFunction<T> = (props: T, resolve: () => void) => void

type PageFlowOptions<T> = {
  props: T,
  flowOut?: FlowFunction<T>,
  flowOutMap?: Map<string, FlowFunction<T>>,
  flowIn?: FlowFunction<T>,
  flowInMap?: Map<string, FlowFunction<T>>,
}

export function usePageFlow<T>({
  props,
  flowOutMap,
  flowOut,
  flowIn,
  flowInMap,
}: PageFlowOptions<T>) {

  const router = useRouter()

  const { flowIsHijackedPromise, flowInPromise, startFlowIn, routeFrom, routeTo } = useFlowProvider()

  const scopeIn = effectScope()
  onMounted(() => {
    if (!flowIsHijackedPromise.value) return
    scopeIn.run(async () => {
      const resolver = startFlowIn()
      await createFlow<T>(routeFrom.value, routeTo.value, flowInMap, flowIn, props)
      resolver && resolver()
    })
  })

  onLeave(async (from, to) => {
    scopeIn.stop()

    const scope = effectScope(true)
    await new Promise<void>((res, rej) => {
      scope.run(async () => {
        await createFlow<T>(from, to, flowOutMap, flowOut, props)
        res()
      })
    })

    scope.stop()

  })
}

function createFlow<T>(from: RouteLocationNormalized, to: RouteLocationNormalized, flowMap: Map<string, FlowFunction<T>> | undefined, flow: FlowFunction<T> | undefined, props: T): Promise<void> {
  const key: string = from.name?.toString() + ' => ' + to.name?.toString()

  let FlowFunction = getFlowFunction(key, flowMap, flow)
  return new Promise<void>(cb => {
    if (!FlowFunction) cb()
    else FlowFunction(props, cb)
  })
}

// TODO Think about the behavior
// route => any
// any => route
function getFlowFunction<T>(key: string, map?: Map<string, FlowFunction<T>>, fallback?: FlowFunction<T>) {
  return map?.get(key) || map?.get('default') || fallback || undefined
}