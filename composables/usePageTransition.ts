import Canvas from "~/scene/canvas";
import { useFlowProvider } from "~/util/FlowProvider";

export type transtionFunction<T> = T & {
  resolve: () => void
}

type PageTranstionOptions<T> = {
  props: T,
  transitionMap: Map<string, (props: T, resolve: () => void, canvas: Ref<Canvas>) => void>,
}


export default function usePageTransition<T>({
  props,
  transitionMap
}: PageTranstionOptions<T>) {
  const provider = useFlowProvider();


  onBeforeRouteLeave((to, from, next) => {
    provider.setLeaveToRoute(to);
    provider.setLeaveFromRoute(from);
    const canvas = provider.canvas

    let transition = transitionMap?.get(from.name?.toString() + ' => ' + to.name?.toString()) || transitionMap?.get('default') || null

    const resolve = () => {
      provider.unMountBufferPage()
      next()
    }

    transition && transition(props, resolve, canvas!)
  })
}
