
import type { FlowFunction } from "~/waterflow/composables/usePageFlow"

export type TemplateTransitionProps = {
}

export const defaultFlowOut: FlowFunction<TemplateTransitionProps> = (props: {}, resolve) => {

    const tl = useTL()
    const canvas = useCanvas()




    resolve()

}

export const defaultFlowIn: FlowFunction<TemplateTransitionProps> = ({ }, resolve,) => {
    resolve()
}


export const flowOutMap = new Map([
    ['default', defaultFlowOut],
])