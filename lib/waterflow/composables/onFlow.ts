import { EffectScope, onMounted, watch } from "vue"
import { useFlowProvider } from "../FlowProvider"
import type { RouteLocationNormalized } from 'vue-router';

export function onFlow(callback?: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void) {
  const { flowIsHijackedPromise, routeFrom, routeTo } = useFlowProvider()
  const flow = ref(false)

  let asyncScope: EffectScope | undefined

  const _flowIsHijackedPromise = flowIsHijackedPromise.length === 0 ? undefined : flowIsHijackedPromise[flowIsHijackedPromise.length - 1]
  _flowIsHijackedPromise !== undefined && _flowIsHijackedPromise.then(() => {
    asyncScope = effectScope(true)
    asyncScope.run(() => {
      flow.value = true
      callback && callback(routeFrom.value, routeTo.value)
    })
  })

  onScopeDispose(() => {
    asyncScope && asyncScope.stop()
  })

  onMounted(() => {
    if (_flowIsHijackedPromise !== undefined) return
    flow.value = true
    callback && callback(routeFrom.value, routeTo.value)
  })

  return flow
}

/** experimental */
export function onLeave(callback: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void) {
  const { currentRoute, flowIsHijackedPromise, flowInPromise, routeFrom, routeTo } = useFlowProvider()
  // const _flowIsHijackedPromise = flowIsHijackedPromise.length === 0 ? undefined : flowIsHijackedPromise[flowIsHijackedPromise.length - 1]

  let once = false
  watch(currentRoute, () => {
    if (flowIsHijackedPromise.length === 0) return
    if (once) return
    once = true
    callback(routeFrom.value, routeTo.value)
  })
  // watch(flowIsHijackedPromise, flow => {
  //   if (!!flow) {
  //     callback(routeFrom.value, routeTo.value)
  //   }
  // })
}