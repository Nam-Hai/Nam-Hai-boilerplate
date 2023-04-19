import { useFlowProvider } from "~/util/FlowProvider";
import { Timeline } from "~/plugins/core/motion";

interface PageTranstionOptions {
  transitionOut?: Timeline,
  guardTransitionOut?: (resolve: () => void) => void
}

export default function usePageTransition({
  transitionOut,
  guardTransitionOut
}: PageTranstionOptions = {}) {
  const provider = useFlowProvider();


  onBeforeRouteLeave((to, from, next) => {
    provider.setLeaveToRoute(to);
    provider.setLeaveFromRoute(from);

    
    console.log('provider, canvas', provider.canvas?.value)
    guard(()=>{provider.unMountBufferPage(); next()},guardTransitionOut)

  })
}

export type GuardFunction = (release: () => void) => void;
// Helper method to guard functions to allow the flow to be hijacked and released when the
// user allows it.
export function guard(
  action: () => void,
  // eslint-disable-next-line no-shadow
  guard?: GuardFunction,
): ((release: () => void) => void) | void {
  if (guard) {
    guard(() => action());
  } else {
    action();
  }
}

