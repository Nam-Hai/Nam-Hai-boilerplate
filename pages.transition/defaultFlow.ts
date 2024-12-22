import { useLayout } from "~/layouts/default.vue"

export const useDefaultFlowIn = () => {
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
                y: [vh.value, 0, "px"]
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
            cb() {
                resolve()
            },
        })
        tl.play()
    }
}

export const useDefaultFlowOut = () => {
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
                y: [0, -3, "rem"],
            },
            d: 750,
            delay: 300,
            e: "o3",
        })

        tl.play().then(() => {
            overlay.value && (overlay.value.style.opacity = "0")
            resolve()
        })
    }
}