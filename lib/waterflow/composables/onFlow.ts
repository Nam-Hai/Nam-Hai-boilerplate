import { onMounted, watch } from "vue"
import { useFlowProvider } from "../FlowProvider"
import type { RouteLocationNormalized } from 'vue-router';

export function onFlow(cb: () => void) {
  const { flowIsHijackedPromise } = useFlowProvider()
  const flow = ref(false)

  flowIsHijackedPromise.value && flowIsHijackedPromise.value.then(() => {
    flow.value = true
    cb && cb()
  })
  onMounted(() => {
    if (!!flowIsHijackedPromise.value) return
    flow.value = true
    cb && cb()
  })

  return flow
}

export function onLeave(callback: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void) {
  const { flowIsHijackedPromise, routeFrom, routeTo } = useFlowProvider()
  watch(flowIsHijackedPromise, flow => {
    console.log("flow leave");
    if (!!flow) {
      callback(routeFrom.value, routeTo.value)
    }
  })
}