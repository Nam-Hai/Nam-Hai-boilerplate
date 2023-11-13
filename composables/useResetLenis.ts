import { onFlow } from "~/waterflow/composables/onFlow"

export const useResetLenis = ({ wrapper, content, target, infinite, direction }: { wrapper?: Window | HTMLElement, content?: HTMLElement, target?: Window | HTMLElement, infinite?: boolean, direction?: "horizontal" | "vertical" } = {}) => {
    const store = useStoreView()

    store.resetLenis({ wrapper, content, target, infinite, direction })
    onFlow(() => {
        store.lenis.value.scrollTo('top', { immediate: true })
    })
}