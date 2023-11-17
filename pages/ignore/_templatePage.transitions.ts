import type { FlowFunction } from "~/waterflow/composables/usePageFlow"

export type TemplateTransitionProps = {
  wrapperRef: Ref<HTMLElement>,
}

const transitionIndexOutDefault: FlowFunction<TemplateTransitionProps> = ({ wrapperRef }, resolve) => {
  const { $TL } = useNuxtApp()
  resolve()
}

export const IndexTransitionOutMap = new Map([
  ['default', transitionIndexOutDefault]
])

const transitionIndexCrossfadeInDefault: FlowFunction<TemplateTransitionProps> = ({ wrapperRef }, resolve) => {
  resolve()
}

export const IndexTransitionCrossfadeMap = new Map([
  ['default', transitionIndexCrossfadeInDefault]
])
