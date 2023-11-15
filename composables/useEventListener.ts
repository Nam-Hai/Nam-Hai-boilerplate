
export function useEventListeneer<K extends keyof WindowEventMap>(target: Ref<Element> | Document, event: K, callback: (e: Event) => void) {
    let t = ref();
    if (target == document) t.value = target;
    else t = target as Ref<Element>

    onMounted(() => {
        console.log('onmount', t);
        t.value.addEventListener(event, callback)
    })
    onBeforeUnmount(() => {
        console.log('onUnmount', t);
        t.value.removeEventListener(event, callback)
    })
}