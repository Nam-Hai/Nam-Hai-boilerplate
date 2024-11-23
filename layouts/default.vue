<template>
  <!-- <div class="app__wrapper" :class="{ flowIsHijacked }"> -->
  <div>

    <!-- <OGLRenderer /> -->
    <!-- <WebGLScene /> -->
    <!-- <Menu /> -->
    <!-- <Cursor v-if="test" /> -->
    <div class="page__wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// import OGLRenderer from '~/ogl.renderer/OGLRenderer.vue';
// import { useFlowProvider } from '~/waterflow/FlowProvider';

// const { flowIsHijacked, currentRoute } = useFlowProvider()
// console.log(flowIsHijacked);

// watch(currentRoute, val => {
//   console.log(val.name);
// }, { immediate: true })

// const test = ref(true)

// setTimeout(() => {
//   test.value = false
// }, 2000)
onMounted(() => {
  const nuxtapp = useNuxtApp()
  console.log(nuxtapp);
  useRaf(()=>{
    // console.log('tes');
  })

  // useMotion({
  //   d: 2000,
  //   update(e) {
  //     console.log(e);
  //   },
  // }).play()
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.page__wrapper {}
</style>
