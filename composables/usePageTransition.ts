import { N } from "~/helpers/namhai-utils";
import { FlowProps, FlowProvider, useFlowProvider } from "~/util/FlowProvider";

export type transitionFunction<T> = (props: T, flowProps: FlowProps, resolve: () => void) => void

type PageTranstionOptions<T> = {
  wrapperRef: Ref<HTMLElement>,
  props: T,
  transitionOutMap?: Map<string, transitionFunction<T>>,
  transitionOut?: transitionFunction<T>,
  transitionInCrossfade?: transitionFunction<T>,
  transitionInCrossfadeMap?: Map<string, transitionFunction<T>>,

  // should probably not use this yet, if you click on a link in the buffer things break
  disablePointerEvent?: boolean,

  // true && 'BOTTOM' && 'UNDER' are the same
  enableCrossfade?: false | true | 'TOP' | 'BOTTOM' | 'UNDER'
}


export default function usePageTransition<T>({
  wrapperRef,
  props,
  transitionOutMap,
  transitionOut,
  transitionInCrossfade,
  transitionInCrossfadeMap,
  enableCrossfade = false,
  disablePointerEvent = true
}: PageTranstionOptions<T>) {
  const { $lenis } = useNuxtApp()
  const provider = useFlowProvider();
  let crossfade = enableCrossfade;

  const flowProps = provider.props

  onMounted(() => {
    provider.flowIsHijacked ? flowCrossfade() : flowIn()
  })

  const flowIn = async () => {
    provider.unMountBufferPage()
  }

  const flowCrossfade = async () => {
    await createFlow<T>(provider, transitionInCrossfadeMap, transitionInCrossfade, props, flowProps)
    provider.releaseHijackFlow()
  }

  if (provider.flowIsHijacked) return
  onBeforeRouteLeave(async (to, from, next) => {
    disablePointerEvent && N.PE.none(document.body)
    $lenis.stop()

    const resolve = async () => {
      next()
    }

    provider.onChangeRoute(to)

    let crossfadeExist = false
    crossfade && (crossfadeExist = provider.triggerCrossfade(crossfade))
    console.log({ crossfadeExist })

    let promiseOut = createFlow<T>(provider, transitionOutMap, transitionOut, props, flowProps)

    let flowPromise = crossfadeExist ? provider.hijackFlow() : null
    await Promise.all([promiseOut, flowPromise])

    $lenis.start()
    $lenis.scrollTo('top', { immediate: true })
    resolve()
    disablePointerEvent && N.PE.all(document.body)
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
