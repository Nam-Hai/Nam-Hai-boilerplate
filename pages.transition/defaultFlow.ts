import { useLayout } from "~/layouts/default.vue"
import { usePageFlow } from "~/lib/waterflow/composables/usePageFlow"

export const useDefaultFlowIn = (axis: "x" | "y" = "y") => {
    const { vh, scale } = useScreen()
    const lenis = useLenis()

    return (props: { main: Ref<HTMLElement | null> }, resolve: () => void) => {
        if (!props.main.value) {
            resolve()
            return
        }
        const tl = useFilm({ watchCleanup: true })
        const bounds = props.main.value.getBoundingClientRect()
        const padding = 60 * scale.value
        const scaleXFrom = (bounds.width - padding) / bounds.width
        props.main.value.style.transformOrigin = `center top`

        tl.from({
            el: props.main.value,
            p: {
                s: [scaleXFrom, scaleXFrom],
                y: [vh.value, padding * scaleXFrom / 2, "px"]
            },
            d: 750,
            e: "io2",
        })
        tl.from({
            el: props.main.value,
            p: {
                s: [scaleXFrom, 1],
                y: [padding * scaleXFrom / 2, 0, "px"],
            },
            d: 750,
            delay: 750,
            e: "io2",
        })
        tl.play().then(() => {
            resolve()
        })
    }
}

export const useDefaultFlowOut = (axis: "x" | "y" = "y") => {
    const { overlay } = useLayout()
    const { vh, scale } = useScreen()
    const lenis = useLenis()

    return (props: { main: Ref<HTMLElement | null> }, resolve: () => void) => {
        if (!props.main.value) {
            resolve()
            return
        }
        const bounds = props.main.value.getBoundingClientRect()
        const padding = 200
        const s = (bounds.width - padding * scale.value) / bounds.width
        const tl = useFilm({ watchCleanup: false })
        props.main.value.style.transformOrigin = `center ${vh.value / 2 + lenis.animatedScroll}px`

        const computedStyle = getComputedStyle(props.main.value)
        const transformMatrix = computedStyle.transform.slice(7, -1).replaceAll(",", "").split(" ")
        const { fromX, fromY, fromScale } = (() => {
            if (transformMatrix.length > 1) {
                return {
                    fromX: +transformMatrix[4],
                    fromY: +transformMatrix[5],
                    fromScale: +transformMatrix[0]
                }
            }
            return {
                fromX: 0,
                fromY: 0,
                fromScale: 1
            }
        })()
        tl.from({
            el: props.main.value,
            p: {
                s: [fromScale, s],
                x: [fromX, 0, "px"],
                y: [fromY, 0, "px"],
            },
            d: 500,
            e: "o2"
        })
        tl.from({
            el: props.main.value,
            p: {
                o: [1, 0]
            },
            d: 1000,
            e: "o2",
        })

        tl.play().then(() => {
            // overlay.value && (overlay.value.style.opacity = "0")
            resolve()
        })
    }
}

export const useDefaultFlow = (main: Ref<HTMLElement | null>, options?: { blocking?: boolean }) => {

    usePageFlow({
        props: {
            main
        },
        flowOutMap: new Map([
            ["default", useDefaultFlowOut()],
        ]),
        flowInMap: new Map([
            ["default", useDefaultFlowIn()],
        ]),
        blocking: options?.blocking
    })
}