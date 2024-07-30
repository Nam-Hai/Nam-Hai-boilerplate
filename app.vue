<template>
  <NuxtLayout>
    <!-- <NuxtPage /> -->
    <CustomRouter />
  </NuxtLayout>
</template>

<script setup lang="ts">
import CustomRouter from './waterflow/CustomRouter.vue';
import { FlowProvider, provideFlowProvider } from './waterflow/FlowProvider';

provideFlowProvider(new FlowProvider)
</script>
