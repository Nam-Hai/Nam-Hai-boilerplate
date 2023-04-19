import { FlowProps, FlowProvider, useFlowProvider } from "~/util/FlowProvider";

export type transitionFunction<T> = (props: T, flowProps: FlowProps, resolve: () => void) => void

type PageTranstionOptions<T> = {
  props: T,
  transitionOutMap?: Map<string, transitionFunction<T>>,
  transitionOut?: transitionFunction<T>,
  transitionIn?: transitionFunction<T>,
  transitionInMap?: Map<string, transitionFunction<T>>,
  transitionInCrossfade?: transitionFunction<T>,
  transitionInCrossfadeMap?: Map<string, transitionFunction<T>>,
  enableCrossfade?: false | true | 'top' | 'bottom'
}


export default function usePageTransition<T>({
  props,
  transitionOutMap,
  transitionOut,
  transitionIn,
  transitionInMap,
  transitionInCrossfade,
  transitionInCrossfadeMap,
  enableCrossfade = false
}: PageTranstionOptions<T>) {
  const provider = useFlowProvider();
  let crossfade = enableCrossfade;

  const flowProps = provider.props

  onMounted(() => {
    provider.flowIsHijacked ? flowCrossfade() : flowIn()
  })

  const flowIn = async () => {
    await createFlow<T>(provider, transitionInMap, transitionIn, props, flowProps)
  }

  const flowCrossfade = async () => {
    await createFlow<T>(provider, transitionInCrossfadeMap, transitionInCrossfade, props, flowProps)
    provider.releaseHijackFlow()
  }

  if (provider.flowIsHijacked) return
  onBeforeRouteLeave(async (to, from, next) => {
    const resolve = async () => {
      next()
      // await nextTick()
      provider.unMountBufferPage()
    }

    provider.onChangeRoute(to)
    let crossfadeExist = true
    crossfade && (crossfadeExist = provider.triggerCrossfade())

    let promiseOut = createFlow<T>(provider, transitionOutMap, transitionOut, props, flowProps)

    let flowPromise = crossfadeExist ? provider.hijackFlow() : null
    await Promise.all([promiseOut, flowPromise])
    resolve()
  })
}

function createFlow<T>(provider: FlowProvider, transitionMap: Map<string, transitionFunction<T>> | undefined, transition: transitionFunction<T> | undefined, props: T, flowProps: FlowProps): Promise<void> {
  const from = provider.getRouteFrom();
  const to = provider.getRouteTo();

  const key: string = from.name?.toString() + ' => ' + to.name?.toString()

  let waterFlow = getWater(key, transitionMap, transition)
  return new Promise<void>(cb => {
    if (!waterFlow) cb()
    else waterFlow(props, flowProps, cb)
  })


}
function getWater<T>(key: string, map?: Map<string, transitionFunction<T>>, fallback?: transitionFunction<T>) {
  return map?.get(key) || map?.get('default') || fallback || undefined
}
