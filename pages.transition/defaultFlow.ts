import { useLayout } from "~/layouts/default.vue"
import { usePageFlow } from "~/lib/waterflow/composables/usePageFlow"

export const useDefaultFlowIn = (axis: "x" | "y" = "y") => {
    const { vh, scale } = useScreen()
    const lenis = useLenis()

    return (props: { main: Ref<HTMLElement | null> }, resolve: () => void) => {
        console.log("flowInc", props.main.value);
        if (!props.main.value) {
            console.log("resole flowIn");
            resolve()
            return
        }
        const tl = useFilm()
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
            console.log("end of defaultFlowIn");
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
        const tl = useFilm()
        props.main.value.style.transformOrigin = `center ${vh.value / 2 + lenis.animatedScroll}px`
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
                s: [1, s]
            },
            d: 500,
            e: "o2"
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
        ]),
        flowInMap: new Map([
            ["default", useDefaultFlowIn()],
        ])
    })
}