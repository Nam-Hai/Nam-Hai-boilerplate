import { onMounted, watch } from "vue"
import { useFlowProvider } from "../FlowProvider"

// To trigger onMount only for the "real" page
export function onFlow(mountedCallback: () => void) {
  const flowProvider = useFlowProvider()
  const flow = ref(false)

  watch(flowProvider.flowIsHijacked, isHijacked => {
    if (!isHijacked && !flow.value) {
      mountedCallback()
      flow.value = true
    }
  })
  onMounted(() => {
    if (!flowProvider.flowIsHijacked.value && !flow.value) {
      mountedCallback()
      flow.value = true
    }
  })

  return flow
}


export function onLeave(callback: () => void) {
  const { flowIsHijacked } = useFlowProvider()
  watch(flowIsHijacked, flow => {
    if (flow) {
      callback()
    }
  })
}