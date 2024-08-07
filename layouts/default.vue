<template>
  <div class="app__wrapper" :class="{ flowIsHijacked }">
    <!-- <OGLRenderer /> -->
    <WebGLScene />
    <Menu />
    <div class="page__wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import OGLRenderer from '~/ogl.renderer/OGLRenderer.vue';
import { useFlowProvider } from '~/waterflow/FlowProvider';

const { flowIsHijacked } = useFlowProvider()
console.log(flowIsHijacked);
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.page__wrapper {}
</style>
