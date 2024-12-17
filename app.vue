<template>
  <NuxtLayout>
    <!-- <NuxtPage /> -->
    <CustomRouter />
  </NuxtLayout>
</template>

<script setup lang="ts">
import CustomRouter from './lib/waterflow/CustomRouter.vue';
import { provideFlowProvider } from './lib/waterflow/FlowProvider';

provideFlowProvider({})
provideScreen({})


</script>
