<template>
  <WebGLScene />

  <BufferPage>
    <Preloader>
      <slot />
    </Preloader>
  </BufferPage>
</template>

<script setup lang="ts">
import { BufferPage, useFlowProvider } from '@nam-hai/water-flow';

const flowProvider = useFlowProvider()

const { lenis } = useStore()


useRaf((e) => {
  !flowProvider.flowIsHijacked.value && lenis.value.raf(e.elapsed)
}, { firstStack: true })

onMounted(() => {
  lenis.value.scrollTo('top')
})

flowProvider.registerScrollInterface({
  resume: () => lenis.value.start(),
  stop: () => lenis.value.stop(),
  scrollToTop: () => { lenis.value.scrollTo('top', { immediate: true }) }
})

</script>

<style lang="scss" scoped></style>
