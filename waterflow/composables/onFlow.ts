import { onMounted, watch } from "vue"
import { useFlowProvider } from "../FlowProvider"

export function onFlow(cb: () => void) {
  const { flowIsHijackedPromise } = useFlowProvider()
  const flow = ref(false)

  flowIsHijackedPromise.value && flowIsHijackedPromise.value.then(() => {
    flow.value = true
    cb && cb()
  })
  onMounted(() => {
    if(!!flowIsHijackedPromise.value) return
    flow.value = true
    cb && cb()
  })

  return flow
}


export function onLeave(callback: () => void) {
  const { flowIsHijackedPromise } = useFlowProvider()
  watch(flowIsHijackedPromise, flow => {
    if (!!flow) {
      callback()
    }
  })
}