
import { N } from "~/helpers/namhai-utils"

type useScrollProgressionOption = {
    el: Ref<HTMLElement>,
    vStart?: number,
    eStart?: number,
    end?: number,
    onEnter?: ()=>void,
    onProgress?: (t:number)=>void
}

export const useScrollProgression = ({
    el,
    vStart = 0,
    eStart = 0,
    end = 0,
    onEnter,
    onProgress
    }: useScrollProgressionOption)=>{
    const hasEnter = ref(false)
    const bounds = ref() as Ref<DOMRect>

    const resize = ()=>{
        bounds.value = el.value.getBoundingClientRect()
        bounds.value.y = bounds.value.top + window.scrollY
    }

    const { vh } = useResize(resize)

    const { raf } = useRaf(()=>{
        const dist = window.scrollY - bounds.value.y + vh.value * vStart /100 -  bounds.value.height * eStart / 100
        const t = N.iLerp(N.Clamp( dist, 0, vh.value * (vStart - end) / 100) / vh.value, 0, (vStart - end )/ 100)
        if(t > 0 && !hasEnter.value) {
            hasEnter.value = true
            onEnter && onEnter()
        }

        onProgress && onProgress(t)
    })

    const intersectionObserver = ref() as Ref<IntersectionObserver>

    onMounted(()=>{
        resize()

        intersectionObserver.value = new IntersectionObserver((entries)=>{
            entries.forEach((entry)=>{
                entry.isIntersecting ? raf.value.run() : raf.value.stop()
            })
        })
        intersectionObserver.value.observe(el.value)
    })

    onBeforeUnmount(()=>{
        intersectionObserver.value.disconnect()
    })
}

type useScrollEventOption = {
    el: Ref<HTMLElement>,
    vStart?: number,
    eStart?: number,
    end?: number,
    onEnter: ()=>void,
}
//lightweight version to only trigger once the event
export const useScrollEvent = ({
    el,
    vStart = 0,
    eStart = 0,
    end = 0,
    onEnter,
    }: useScrollEventOption)=>{
    const bounds = ref() as Ref<DOMRect>

    const resize = ()=>{
        bounds.value = el.value.getBoundingClientRect()
        bounds.value.y = bounds.value.top + window.scrollY
    }
    const { vh } = useResize(resize)
    const { raf } = useRaf(()=>{
        const dist = window.scrollY - bounds.value.y + vh.value * vStart /100 -  bounds.value.height * eStart / 100
        const t = N.iLerp(N.Clamp( dist, 0, vh.value * (vStart - end) / 100) / vh.value, 0, (vStart - end )/ 100)
        if(t > 0 ) {
            onEnter && onEnter()
            raf.value.stop()
            intersectionObserver.value.disconnect()
        }
    })
    const intersectionObserver = ref() as Ref<IntersectionObserver>
    onMounted(()=>{
        resize()
        intersectionObserver.value = new IntersectionObserver((entries)=>{
            entries.forEach((entry)=>{
                entry.isIntersecting ? raf.value.run() : raf.value.stop()
            })
        })
        intersectionObserver.value.observe(el.value)
    })

    onBeforeUnmount(()=>{
        intersectionObserver.value.disconnect()
    })
}