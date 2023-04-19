import type { RouteLocationNormalized } from 'vue-router';
import Canvas from "~/scene/canvas";
import { useFlowProvider } from "~/util/FlowProvider";

export type transitionFunction<T> = (props: T, resolve: () => void, canvas?: Ref<Canvas>) => void

type PageTranstionOptions<T> = {
  props: T,
  transitionOutMap?: Map<string, transitionFunction<T>>,
  transitionOut?: transitionFunction<T>,
  transitionIn?: transitionFunction<T>,
  transitionInCrossfade?: transitionFunction<T>,
  transitionInCrossfadeMap?: transitionFunction<T>,
  enableCrossfade?: boolean
}


export default function usePageTransition<T>({
  props,
  transitionOutMap,
  transitionOut,
  enableCrossfade = false
}: PageTranstionOptions<T>) {
  const provider = useFlowProvider();
  const crossfade = enableCrossfade


  onBeforeRouteLeave(async (to, from, next) => {
    provider.setLeaveToRoute(to, crossfade);
    provider.setLeaveFromRoute(from);
    const canvas = provider.canvas

    let waterOut = getWater(from, to, transitionOutMap, transitionOut)

    const resolve = () => {
      provider.unMountBufferPage()
      next()
    }

    let promiseOut = new Promise<void>(cb => {
      if (!waterOut) cb()
      else {
        waterOut(props, cb, canvas!)
      }
    })
    let promiseCrossfade = new Promise<void>(cb => {
      setTimeout(() => {
        cb()
      }, 3000)
    })
    await Promise.all([promiseOut, promiseCrossfade])
    resolve()
  })
}

function getWater<T>(from: RouteLocationNormalized, to: RouteLocationNormalized, map?: Map<string, transitionFunction<T>>, fallback?: transitionFunction<T>){
    const key: string = from.name?.toString() + ' => ' + to.name?.toString()
    return map?.get(key) || map?.get('default') || fallback || undefined
}
