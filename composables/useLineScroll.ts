export const useLineScroll = (el: Ref<HTMLElement>, trigger: Ref<boolean>, start: number = 0, duration = 100) => {

    useSplitAnime(el, trigger)

    let newLines: HTMLElement[] = []
    onMounted(() => {
        N.Class.add(el.value, 'line-highlight__wrapper')
        const lines = N.getAll('.splited-line', el.value) as unknown as HTMLElement[]
        for (const line of lines) {
            const text = line.innerText
            const span = N.Cr('span')
            N.Class.add(span, 'line-highlight__stunt')
            span.innerText = text
            line.appendChild(span)

            newLines.push(span)
        }
    })

    useScrollEvent({
        el,
        vEnd: 100,
        eStart: start,
        eEnd: duration + start,
        onProgress(t) {
            const l = newLines.length
            const i = t * l
            for (const [index, line] of Object.entries(newLines)) {
                const t = i - +index
                line.style.clipPath = `inset(0 ${(1 - t) * 100}% 0 0)`
            }
        },
    })
}