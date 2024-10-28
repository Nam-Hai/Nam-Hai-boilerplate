<script lang="ts" setup>
import { useStoreView } from '~/composables/useStoreView';


const wrapperRef = ref() as Ref<HTMLElement>

const { mouse } = useStoreView()

useRaf((e) => {
    // console.log(mouse.value);
})
</script>

<template>
    <div class="curose__wrapper" ref="wrapperRef" :style="{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }">

    </div>
</template>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.curose__wrapper {
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    background: #000;

    z-index: 29999;

    position: fixed;
    top: -0.5rem;
    left: -0.5rem;
}
</style>
