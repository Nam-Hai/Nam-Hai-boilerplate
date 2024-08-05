<template>
  <div class="menu__wrapper">
    <NuxtLink to="/" class="menu-item">
      Boilerplate
    </NuxtLink>
    <NuxtLink to="/animation-engine" class="menu-item">
      Animation Engine
    </NuxtLink>
    <NuxtLink class="menu-item" to="/vue-custom-router">
      Vue Custom Router
    </NuxtLink>
    <NuxtLink class="menu-item" to="/vue-custom-ogl-renderer">
      Vue OGL Renderer
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.menu__wrapper {
  z-index: 1000;
  position: absolute;
  top: 8rem;
  left: 22rem;
  display: flex;
  flex-direction: column;

  font-size: 2rem;
}
</style>
