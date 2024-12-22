<template>
  <NuxtLayout>
    <!-- <NuxtPage v-if="false" /> -->

    <CustomRouter :scroll-top-api="() => lenis.scrollTo('top', { immediate: true })" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import CustomRouter from './lib/waterflow/CustomRouter.vue';
import { provideFlowProvider } from './lib/waterflow/FlowProvider';

provideFlowProvider({})
provideScreen({})
const lenis = useLenis()


</script>
