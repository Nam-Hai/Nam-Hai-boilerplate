import { useLayout } from "~/layouts/default.vue"
import { usePageFlow } from "~/lib/waterflow/composables/usePageFlow"

export const useDefaultFlowIn = (axis: "x" | "y" = "y") => {
    const { vh, vw, scale } = useScreen()
    const lenis = useLenis()

    return (props: { main: Ref<HTMLElement | null> }, resolve: () => void) => {
        if (!props.main.value) {
            resolve()
            return
        }
        const tl = useFilm({ watchCleanup: true })
        const bounds = props.main.value.getBoundingClientRect()
        const padding = 60 * scale.value
        const wh = axis === "y" ? "width" : "height"
        const scaleXFrom = (bounds[wh] - padding) / bounds[wh]
        props.main.value.style.transformOrigin = axis === "y" ? `center top` : `left center`

        tl.from({
            el: props.main.value,
            p: {
                s: [scaleXFrom, scaleXFrom],
                [axis]: axis === "y" ? [vh.value, padding * scaleXFrom / 2, "px"] : [vw.value, padding * scaleXFrom / 2, "px"]
            },
            d: 750,
            e: "io2",
        })
        tl.from({
            el: props.main.value,
            p: {
                s: [scaleXFrom, 1],
                [axis]: [padding * scaleXFrom / 2, 0, "px"],
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
        N.Class.add(props.main.value, "hide")

        tl.play().then(() => {
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
            ["any => foo", useDefaultFlowIn("x")],
        ]),
        blocking: options?.blocking
    })
}