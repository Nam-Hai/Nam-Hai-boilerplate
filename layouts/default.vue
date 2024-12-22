<template>
  <div class="layout__wrapper">
    <div class="page__wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  console.log('test');
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.layout__wrapper {

}

.page__wrapper {}
</style>
