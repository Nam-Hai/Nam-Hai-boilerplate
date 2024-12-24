import { useFlowProvider } from "../FlowProvider";
import type { RouteLocationNormalized } from "#vue-router";
import { onLeave } from "./onFlow";
import { onWatcherCleanup } from "vue";

export type FlowFunction<T> = (props: T, resolve: () => void) => void

type FlowKey = `default` | `${string} => ${string}`;

type PageFlowOptions<T> = {
  props: T,
  flowOutMap?: Map<FlowKey, FlowFunction<T>>,
  flowInMap?: Map<FlowKey, FlowFunction<T>>,
  blocking?: boolean
}

export function usePageFlow<T>({
  props,
  flowOutMap,
  flowInMap,
  blocking = false
}: PageFlowOptions<T>) {

  const { flowIsHijackedPromise, flowInPromise, startFlowIn, routeFrom, routeTo } = useFlowProvider()

  const scopeIn = effectScope(true)

  const previousFlowInPromise = flowInPromise.length > 0 ? flowInPromise[0] : undefined
  const resolver = startFlowIn(blocking)
  const _flowInPromise = flowInPromise[0]
  onMounted(async () => {

    if (flowIsHijackedPromise.length === 0) return resolver()

    blocking && await previousFlowInPromise?.promise

    scopeIn.run(async () => {
      await createFlow<T>(routeFrom.value, routeTo.value, flowInMap, props)
      scopeIn.active && resolver()
    })
  })

  onLeave(async (from, to) => {

    if (blocking) {
      await _flowInPromise.promise
      resolver()
    }


    scopeIn.stop()

    const scope = effectScope(true)
    await new Promise<void>((res, rej) => {
      scope.run(async () => {
        await createFlow<T>(from, to, flowOutMap, props)
        res()
      })
    })

    if (!blocking) resolver()
    scope.stop()

  })
}

function createFlow<T>(from: RouteLocationNormalized, to: RouteLocationNormalized, flowMap: Map<string, FlowFunction<T>> | undefined, props: T): Promise<void> {
  const fromName = from.name?.toString(), toName = to.name?.toString()
  const key: string = fromName + ' => ' + toName
  const keyDefaultIn = fromName + " => any"
  const keyDefaultOut = "any => " + toName

  const FlowFunction = flowMap?.get(key) || flowMap?.get(keyDefaultIn) || flowMap?.get(keyDefaultOut) || flowMap?.get('default') || undefined
  return new Promise<void>(cb => {
    if (!FlowFunction) cb()
    else FlowFunction(props, cb)
  })
}