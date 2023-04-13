
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
    const offset = ref(0)

    const wSize = ref({width: 0, height: 0}) 
    onMounted(()=>{
        wSize.value = {width: innerWidth, height: innerHeight}
        bounds.value = el.value.getBoundingClientRect()
    })

    useRaf(()=>{
        const dist = window.scrollY - bounds.value.top + wSize.value.height * vStart /100 -  bounds.value.height * eStart / 100
        const t = N.iLerp(N.Clamp( dist, 0, wSize.value.height * (vStart - end) / 100) / wSize.value.height, 0, (vStart - end )/ 100)
        if(t > 0) hasEnter.value =  true

        onProgress && onProgress(t)
    })

    watch(hasEnter, (enter)=>{
        enter && onEnter && onEnter()
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