<template>
  <div class="wrapper">
    <TheParallax :amount="1.2">
      <div></div>
    </TheParallax>
    <TheParallax :amount="1.09">
      <div></div>
    </TheParallax>
    <TheParallax :amount="1.1">
      <div></div>
    </TheParallax>
    <div ref="pinRef"></div>
    <div></div>
  </div>
</template>

<script setup lang="ts">

const { $lenis } = useNuxtApp()
const pinRef = ref()

usePin({
  el: pinRef,
  start:0,

})

</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  column-gap: 1rem;
  height: 800rem;
  margin-top: 170rem;


  > div {
    width: 15rem;
    height: 15rem;

    &:nth-child(4n) {
      background: red;
    }

    &:nth-child(4n + 1) {
      background: blue;
    }

    &:nth-child(4n + 2) {
      background: crimson;
    }

    &:nth-child(4n + 3) {
      background-color: green;
    }
  }
}</style>
