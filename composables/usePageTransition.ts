import Canvas from "~/scene/canvas";
import { useFlowProvider } from "~/util/FlowProvider";

export type transtionFunction<T> = (props: T, resolve: () => void, canvas?: Ref<Canvas>) => void

type PageTranstionOptions<T> = {
  props: T,
  transitionOutMap?: Map<string, transtionFunction<T>>,
  transitionOut?: transtionFunction<T>,
  crossfade?: boolean
}


export default function usePageTransition<T>({
  props,
  transitionOutMap,
  transitionOut,
  crossfade = false
}: PageTranstionOptions<T>) {
  const provider = useFlowProvider();


  onBeforeRouteLeave(async (to, from, next) => {
    provider.setLeaveToRoute(to, crossfade);
    provider.setLeaveFromRoute(from);
    const canvas = provider.canvas

    let transition = transitionOutMap?.get(from.name?.toString() + ' => ' + to.name?.toString()) || transitionOutMap?.get('default') || transitionOut || undefined

    const resolve = () => {
      provider.unMountBufferPage()
      next()
    }

    if (transition) {
      await new Promise<void>(cb => {
        transition && transition(props, cb, canvas!)
      })
      resolve()
    } else {
      resolve()
    }
  })
}
