<template>
  <Menu />
  <div class="page__wrapper">
    <slot />
  </div>
</template>


<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.layout__wrapper {}

.page__wrapper {}
</style>
