import { useLayout } from "~/layouts/default.vue"
import { usePageFlow } from "~/lib/waterflow/composables/usePageFlow"

export const useDefaultFlowIn = (axis: "x" | "y" = "y") => {
    const { vh, scale } = useScreen()

    return (props: { main: Ref<HTMLElement | null> }, resolve: () => void) => {
        if (!props.main.value) {
            resolve()
            return
        }
        const tl = useFilm()
        const bounds = props.main.value.getBoundingClientRect()
        const scaleYFrom = (bounds.height - 30 * scale.value) / bounds.height
        const scaleXFrom = (bounds.width - 30 * scale.value) / bounds.width
        props.main.value.style.transformOrigin = `${vh.value / 2}px center`

        tl.from({
            el: props.main.value,
            p: {
                scaleX: [scaleXFrom, scaleXFrom],
                scaleY: [scaleYFrom, scaleYFrom],
                [axis]: [vh.value, 0, "px"]
            },
            d: 750,
            e: "io2",
        })
        tl.from({
            el: props.main.value,
            p: {
                scaleX: [scaleXFrom, 1],
                scaleY: [scaleYFrom, 1],
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
    return (props: { main: Ref<HTMLElement | null> }, resolve: () => void) => {
        if (!props.main.value) {
            resolve()
            return
        }
        const tl = useFilm()
        tl.from({
            el: overlay.value as HTMLElement,
            p: {
                o: [0, 0.8],
            },
            d: 1500,
        })
        tl.from({
            el: props.main.value,
            p: {
                [axis]: [0, -6, "rem"],
            },
            d: 1200,
            delay: 100,
            e: "o1",
        })

        tl.play().then(() => {
            overlay.value && (overlay.value.style.opacity = "0")
            resolve()
        })
    }
}

export const useDefaultFlow = (main: Ref<HTMLElement | null>) => {

    usePageFlow({
        props: {
            main
        },
        flowOutMap: new Map([
            ["default", useDefaultFlowOut()],
            ["any => work-slug", useDefaultFlowOut("x")],
            ["work-slug => work-slug", useDefaultFlowOut("x")]
        ]),
        flowInMap: new Map([
            ["default", useDefaultFlowIn()],
            ["any => work-slug", useDefaultFlowIn("x")],
            ["work-slug => work-slug", useDefaultFlowIn("x")]
        ])
    })
}