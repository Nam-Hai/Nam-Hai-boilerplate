<script lang="ts" setup>
import { useStoreCursor } from '~/composables/useStore';
import { useStoreView } from '~/composables/useStoreView';


const wrapperRef = ref() as Ref<HTMLElement>

const { mouse, vw } = useStoreView()

useRaf((e) => {
    // console.log(mouse.value);
})

const { cursorState } = useStoreCursor()
watch(cursorState, val => {
    console.log(val);
})
</script>

<template>
    <div class="curose__wrapper" :class="{ 'cursor-1': cursorState === 1, 'cursor-2': cursorState === 2 }"
        ref="wrapperRef" :style="{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }">
    </div>
    <div class="curose__wrapper" :class="{ 'cursor-1': cursorState === 1, 'cursor-2': cursorState === 2 }"
        ref="wrapperRef" :style="{ transform: `translate(${(mouse.x + vw / 2) % vw}px, ${mouse.y}px)` }">
    </div>
</template>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.curose__wrapper {
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    background-color: #000;

    z-index: 29999;

    position: fixed;
    top: -0.5rem;
    left: -0.5rem;

    transition: background-color 450ms ease, border-radius 900ms, height 900ms, width 900ms;

    &.cursor-1 {
        background-color: red;
    }

    &.cursor-2 {
        border-radius: 0;
        height: 1.8rem;
        width: 1.8rem;
    }
}
</style>
