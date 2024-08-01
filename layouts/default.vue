<template>
  <div class="app__wrapper">
    <WebGLScene />
    <div class="page__wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

a {
  font-size: 5rem;
  line-height: 100%;
  padding: 2rem;
}

.page__wrapper {
}
</style>
