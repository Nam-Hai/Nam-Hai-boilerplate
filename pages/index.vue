<template>
    <main ref="mainRef">
        <p v-cursor>
            hey this is my boilerplate™<br>
            {{ lorem }}
        </p>
    </main>
</template>

<script lang="ts" setup>
import { lorem } from '~/assets/lorem';
import { useLayout } from '~/layouts/default.vue';
import { usePageFlow } from '~/lib/waterflow/composables/usePageFlow';

const mainRef = useTemplateRef("mainRef")

const { overlay } = useLayout()

usePageFlow({
    props: {
        mainRef
    },
    flowIn: (props, resolve) => {
        resolve()
    },
    flowOut: (props, resolve) => {
        if (!props.mainRef.value) {
            resolve()
            return
        }
        const tl = useFilm()
        tl.from({
            el: overlay.value as HTMLElement,
            p: {
                o: [0, 0.8],
            },
            d: 1500,
        })
        tl.from({
            el: props.mainRef.value,
            p: {
                y: [0, -5, "rem"],
            },
            d: 750,
            delay: 750,
            e: "o3",
            cb() {
                overlay.value && (overlay.value.style.opacity = "0")
                resolve()
            },
        })

        tl.play()
    }
})

</script>

<style lang="scss" scoped></style>
