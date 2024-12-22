<template>
  <div class="menu__wrapper">
    <NuxtLink :to="{ name: 'index' }" class="menu-item">
      home
    </NuxtLink>
    <NuxtLink :to="{ name: 'foo' }" class="menu-item">
      foo
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
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
