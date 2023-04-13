
import { N } from "~/helpers/namhai-utils"

// vStart === viewportStart
type useScrollEventOption = {
    el: Ref<HTMLElement>,
    vStart?: number,
    eStart?: number,
    end?: number,
    onEnter?: ()=>void,
    onProgress?: (t:number)=>void
}

export const useScrollEvent = ({
    el,
    vStart = 0,
    eStart = 0,
    end = 0,
    onEnter,
    onProgress
    }: useScrollEventOption)=>{
    const hasEnter = ref(false)
    const bounds = ref() as Ref<DOMRect>


    onMounted(()=>{
        resize()
    })
    const resize = ()=>{
        bounds.value = el.value.getBoundingClientRect()
        bounds.value.y = bounds.value.top + window.scrollY
    }

    const { vh } = useResize(resize)

    useRaf(()=>{
        const dist = window.scrollY - bounds.value.y + vh.value * vStart /100 -  bounds.value.height * eStart / 100
        const t = N.iLerp(N.Clamp( dist, 0, vh.value * (vStart - end) / 100) / vh.value, 0, (vStart - end )/ 100)
        if(t > 0 && !hasEnter.value) {
            hasEnter.value = true
            onEnter && onEnter()
        }

        onProgress && onProgress(t)
    })

}

// useScrollEvent({
//     el: testRef,
//     vStart: 80,
//     eStart: 100,
//     onEnter: ()=>{
//         console.log('onenter');
//        let tl = new $TL() 
//        tl.from({
//         el: testRef.value,
//         p: {
//             x: [-100, 0]
//         },
//         d: 2000,
//         e: 'io3'
//        }).play()
//     }
// })