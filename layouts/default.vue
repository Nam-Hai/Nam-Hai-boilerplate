<template>
  <div class="app__wrapper">
    <WebGLScene />
    <Menu />
    <div class="page__wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.page__wrapper {}
</style>
