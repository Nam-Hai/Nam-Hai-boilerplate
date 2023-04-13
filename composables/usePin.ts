import { N } from "~/helpers/namhai-utils"

type usePinOptions = {
    el: Ref<HTMLElement>,
    start?: number,
    end?: number,
    onEnter?: ()=>void
}

export const usePin = ({
    el,
    start = 0,
    end = Infinity,
    onEnter
    }: usePinOptions)=>{

    const hasEnter = ref(false)
    const bounds = ref() as Ref<DOMRect>
    const offset = ref(0)

    onMounted(()=>{
        bounds.value = el.value.getBoundingClientRect()
    })

    useRaf(()=>{
        offset.value = N.Clamp(window.scrollY - bounds.value.top + start, 0, end)
        if(offset.value > 0) hasEnter.value = true

        N.T(el.value,0,offset.value, 'px')
    })

    watch(hasEnter, ()=>{
        onEnter && onEnter()
    })

}