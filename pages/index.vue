<template>
    <main ref="mainRef">
    </main>
</template>

<script lang="ts" setup>
import { onFlow, onLeave } from '~/waterflow/composables/onFlow';
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const mainRef = shallowRef()
usePageFlow({
    props: {
        mainRef
    },
    flowIn: (props, res) => {
        res()
    },
    flowOut: (props, res) => {
        res()
    }
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
    top: 0;
    line-height: 100%;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
        font-size: 5;
    }

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
