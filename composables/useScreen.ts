export const [provideScreen, useScreen] = createContext(() => {
    const vh = ref(0)
    const vw = ref(0)
    const dpr = ref(1)

    onMounted(() => {

        useResize((e) => {
            vh.value = e.vh
            vw.value = e.vw
            dpr.value = window.devicePixelRatio
        })
    })

    return {
        vh,
        vw,
        dpr
    }
})