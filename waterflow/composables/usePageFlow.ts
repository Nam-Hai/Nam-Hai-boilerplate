import { onMounted, onUnmounted } from "vue";
import { type FlowProps, FlowProvider, useFlowProvider } from "../FlowProvider";
import { useRouter } from "vue-router";

export type FlowFunction<T> = (props: T, resolve: () => void) => void

// TODO cancel animation if a new route is taken early
type PageFlowOptions<T> = {
  props: T,
}

export function usePageFlow<T>({
  props,
}: PageFlowOptions<T>) {
  const provider = useFlowProvider();

  const router = useRouter()
  const routerGuard = router.beforeEach(async (to, _from, next) => {
    // mount next page
    provider.onChangeRoute(to)
    next()
    console.log(provider.routeFrom.value?.name, provider.routeTo.value.name);
  })


  onUnmounted(() => {
    console.log("usePageFlow unMounted", router.currentRoute.value.name);
    routerGuard()
  })
}