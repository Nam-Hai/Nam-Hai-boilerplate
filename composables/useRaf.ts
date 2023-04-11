import { rafCbType } from "../plugins/core/raf";

export const useRaf = (cb: (e:rafCbType) => {})=>{
    const { $RafR } = useNuxtApp()

    const raf = new $RafR(cb)

    onMounted(()=>{
        raf.run()
    })

    onBeforeUnmount(()=>{
        raf.stop()
    })

    return {
        raf
    }
}