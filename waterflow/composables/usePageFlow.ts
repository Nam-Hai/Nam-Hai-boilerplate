import { onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { delay } from "~/plugins/core/raf";
import { useFlowProvider } from "../FlowProvider";
import type { RouteLocationNormalized } from "#vue-router";

export type FlowFunction<T> = (props: T, resolve: () => void) => void

type PageFlowOptions<T> = {
  props: T,
  flowOut?: FlowFunction<T>,
  flowOutMap?: Map<string, FlowFunction<T>>,
  flowInCrossfade?: FlowFunction<T>,
  flowInCrossfadeMap?: Map<string, FlowFunction<T>>,
}

export function usePageFlow<T>({
  props,
  flowOutMap,
  flowOut,
  flowInCrossfade,
  flowInCrossfadeMap,
}: PageFlowOptions<T>) {

  const router = useRouter()

  const { flowInPromise, startFlowIn } = useFlowProvider()

  onMounted(async () => {
    const resolver = startFlowIn()
    console.log("flow in", resolver);
    await delay(Math.random() * 2000)
    resolver && resolver()
  })

  const routerGuard = router.beforeEach(async (to, from, next) => {

    let promiseOut = createFlow<T>(from, to, flowOutMap, flowOut, props)

    await Promise.all([promiseOut, flowInPromise.value])
    // mount next page

    next()
  })

  onUnmounted(() => {
    routerGuard()
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