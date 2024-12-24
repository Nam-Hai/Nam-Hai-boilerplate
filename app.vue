<template>
  <NuxtLayout>
    <!-- <NuxtPage /> -->


    <WaterflowRouter :scroll-top-api="() => lenis.scrollTo('top', { immediate: true })" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import WaterflowRouter from './lib/waterflow/WaterflowRouter.vue';
import { provideFlowProvider } from './lib/waterflow/FlowProvider';

const route = useRoute()
provideFlowProvider({ route })
provideScreen({})
const lenis = useLenis()


</script>
