<template>
  <TheWebGLScene />
  <TheBufferPage />

  <div id="app_DOM">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useFlowProvider } from '~/util/FlowProvider';
// configure lenis in @/plugins/lenis.client.ts
const { $lenis } = useNuxtApp()

const flowProvider = useFlowProvider()


useRaf((e) => {
  !flowProvider.flowIsHijacked && $lenis.raf(e.elapsed)
})

flowProvider.registerScrollInterface({
  resume: () => { $lenis.start() },
  stop: () => { $lenis.stop() },
  scrollToTop: () => { $lenis.scrollTo('top', { immediate: true }) }
})

</script>

<style lang="scss" scoped>
#app_DOM {
  position: relative;
  z-index: 2;
}
</style>
