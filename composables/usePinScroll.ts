import { Timer } from "~/plugins/core/raf"

export function usePinScroll({
    el,
    reach = 20,
    hardReach = reach / 2
}: {
    el: Ref<HTMLElement>,
    reach: number,
    hardReach: number
}) {

    const bounds = reactive({
        y: 0,
        height: 0
    })

    let current = 0
    const timer = ref() as Ref<Timer>
    const { lenis } = useStore()


    const pin = () => {
        if (Math.abs(current - bounds.y) < reach) {
            lenis.value.scrollTo(bounds.y, {
                easing: N.Ease.io4
            })
        }
    }

    const resize = () => {
        let boundsRect = el.value.getBoundingClientRect()
        bounds.y = boundsRect.top + window.scrollY
        bounds.height = boundsRect.height
    }
    useRO(resize)

    onMounted(() => {
        timer.value = useTimer(pin, 100)
        let boundsRect = el.value.getBoundingClientRect()
        bounds.y = boundsRect.top + window.scrollY
        bounds.height = boundsRect.height
    })

    let skip = 0
    useLenisScroll(e => {
        current = e.animatedScroll
        // if (Math.abs(current - bounds.y) < hardReach) {
        //     skip++
        //     skip != 5 && (skip = 0)
        //     lenis.value.targetScroll = bounds.y
        // }
        if (Math.abs(current - bounds.y) < reach) {
            timer.value.tick()
        }
    })
}