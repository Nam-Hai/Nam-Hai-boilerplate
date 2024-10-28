<template>
  <div class="app__wrapper" :class="{ flowIsHijacked }">
    <!-- <OGLRenderer /> -->
    <WebGLScene />
    <Menu />
    <Cursor />
    <div class="page__wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import OGLRenderer from '~/ogl.renderer/OGLRenderer.vue';
import { useFlowProvider } from '~/waterflow/FlowProvider';

const { flowIsHijacked, currentRoute } = useFlowProvider()
console.log(flowIsHijacked);

watch(currentRoute, val => {
  console.log(val.name);
}, { immediate: true })
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.page__wrapper {}
</style>
