<template>
  <div class="menu__wrapper">
    <NuxtLink :to="{ name: 'index' }" class="menu-item">
      home
    </NuxtLink>
    <NuxtLink :to="{ name: 'foo' }" class="menu-item">
      foo
    </NuxtLink>
    <NuxtLink :to="{ name: 'baz' }" class="menu-item">
      baz
    </NuxtLink>
    <NuxtLink :to="{ name: 'work-slug', params: { slug: slug } }" class="menu-item">
      slug
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const slug = "yoooo-12"
</script>

<style lang="scss" scoped>
.menu__wrapper {
  z-index: 1000;
  position: fixed;
  top: 8rem;
  left: 22rem;
  display: flex;
  flex-direction: column;

  font-size: 2rem;
  row-gap: 1rem;
}

.menu-item {
  padding: 0.5rem;
  background-color: blanchedalmond;
}
</style>
