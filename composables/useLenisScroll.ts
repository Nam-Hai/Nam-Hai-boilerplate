export const useLenisScroll = (callback: (e:any)=>void)=>{
    const { $lenis } = useNuxtApp()
    onMounted(()=>{
        $lenis.on('scroll', callback)
        $lenis.emit()
    })
    onBeforeUnmount(()=>{
        $lenis.off('scroll', callback)
    })

    const on = ()=>$lenis.on('scroll', callback)
    const off = ()=>$lenis.off('scroll', callback)

    return { lenis: {
        run: on,
        stop: off,
        on,
        off,
        // emit: $lenis.emit,
        c: $lenis
    } }
}