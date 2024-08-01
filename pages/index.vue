<template>
    <main ref="mainRef">
        index page
        <NuxtLink to="/playground">playground</NuxtLink>

        <div class="d" v-for="i in 15">
            <div class="a"></div>
            <div class="b"></div>
            <div class="c"></div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { onFlow, onLeave } from '~/waterflow/composables/onFlow';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const mainRef = shallowRef()

onFlow(() => {
    console.log("on flow");
})

onLeave(() => {
    console.log("on leave");
})
usePageFlow({
    props: {
        mainRef
    },
    flowIn: (props, res) => {

        const tl = useTL()
        tl.from({
            el: props.mainRef.value,
            d: 1000,
            e: "o4",
            p: {
                y: [100, 0]
            },
            cb() {
                res()
            },
        })
        tl.play()
    },
    flowOut: (props, res) => {
        const tl = useTL()
        tl.from({
            el: props.mainRef.value,
            d: 1000,
            e: "i4",
            p: {
                y: [0, 100]
            },
            cb() {
                res()
            },
        })
        tl.play()
    }
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
    top: 0;
    line-height: 100%;
    font-size: 20rem;

    a {
        font-size: 5rem;
        line-height: 100%;
        padding: 2rem;
    }

    .d div {
        height: 4rem;
        width: 100%;

        &.a {
            background-color: red;
        }

        &.b {
            background-color: blue;
        }

        &.c {
            background: black;
        }
    }
}
</style>
