
import { N } from "~/helpers/namhai-utils"

// vStart === viewportStart
type useScrollEventOption = {
    el: Ref<HTMLElement>,
    vStart?: number,
    eStart?: number,
    end?: number,
    onEnter?: ()=>void,
    onEnterOnce?: boolean
}

export const useScrollEvent = ({
    el,
    vStart = 0,
    eStart = 0,
    end = Infinity,
    onEnter,
    }: useScrollEventOption)=>{
    const hasEnter = ref(false)
    const bounds = ref() as Ref<DOMRect>
    const offset = ref(0)

    const wSize = ref({width: 0, height: 0}) 
    onMounted(()=>{
        wSize.value = {width: innerWidth, height: innerHeight}
        bounds.value = el.value.getBoundingClientRect()
    })

    useRaf(()=>{
        offset.value = N.Clamp(window.scrollY - bounds.value.top + wSize.value.height * vStart /100 - bounds.value.height * eStart / 100, 0, end)
        if(offset.value > 0) hasEnter.value =  true

        // N.T(el.value,0,offset.value, 'px')
    })

    watch(hasEnter, (enter)=>{
        enter && onEnter && onEnter()
    })

}