<template>
  <div ref="wrapperRef" class="wrapper">
    COMPONENT
  </div>
</template>
<script setup lang="ts">
import { onFlow } from '@nam-hai/water-flow'

const { $TL } = useNuxtApp()
const wrapperRef = ref()

onFlow(() => {
  let tl = new $TL
  tl.from({
    el: wrapperRef.value,
    p: {
      r: [0, 180]
    },
    d: 500,
  }).play()
})

</script>
<style lang="scss" scoped>
.wrapper {
  background-color: crimson !important;
  ;
}
</style>
