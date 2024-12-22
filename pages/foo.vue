<template>
    <main ref="main">
        <p>
            {{ lorem }}
        </p>
    </main>
</template>

<script setup lang="ts">
import { lorem } from '~/assets/lorem';
import { useLayout } from '~/layouts/default.vue';
import { usePageFlow } from '~/lib/waterflow/composables/usePageFlow';

const { overlay } = useLayout()
const { vh, scale } = useScreen()
onMounted(() => {
    console.log(vh.value);

})
const main = useTemplateRef("main")
usePageFlow({
    props: {
        main
    },
    flowIn: (props, resolve) => {
        if (!props.main.value) {
            resolve()
            return
        }
        const tl = useFilm()
        const bounds = props.main.value.getBoundingClientRect()
        const scaleYFrom = (bounds.height - 30 * scale.value) / bounds.height
        const scaleXFrom = (bounds.width - 30 * scale.value) / bounds.width
        console.log(scaleXFrom);
        props.main.value.style.transformOrigin = `${vh.value / 2}px center`

        tl.from({
            el: props.main.value,
            p: {
                scaleX: [scaleXFrom, scaleXFrom],
                scaleY: [scaleYFrom, scaleYFrom],
                y: [vh.value, 0, "px"]
            },
            d: 750,
            e: "io2",
        })
        tl.from({
            el: props.main.value,
            p: {
                scaleX: [scaleXFrom, 1],
                scaleY: [scaleYFrom, 1],
            },
            d: 750,
            delay: 750,
            e: "io2",
            cb() {
                resolve()
            },
        })
        tl.play()
    },
})
</script>

<style scoped lang="scss">
main {}
</style>