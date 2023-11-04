<template>
  <div class="app__wrapper">
    <WebGLScene />
    <div class="page__wrapper">
      <Preloader>
        <BufferPage />
      </Preloader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFlowProvider } from "~/waterflow/FlowProvider";
import BufferPage from "~/waterflow/components/BufferPage.vue";

const flowProvider = useFlowProvider();

const lenis = useStore().lenis;

useRaf(
  (e) => {
    !flowProvider.flowIsHijacked.value && lenis.value.raf(e.elapsed);
  },
  { firstStack: true }
);

flowProvider.registerScrollInterface({
  resume: () => {
    lenis.value.start();
  },
  stop: () => {
    lenis.value.stop();
  },
  scrollToTop: () => {
    lenis.value.scrollTo("top", { immediate: true });
  },
});
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;
</style>
