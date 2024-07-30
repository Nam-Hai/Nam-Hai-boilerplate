<template>
  <NuxtLayout>
    <!-- <NuxtPage /> -->
    <CustomRouter />
  </NuxtLayout>
</template>

<script setup lang="ts">
import CustomRouter from './waterflow/CustomRouter';
import { FlowProvider, provideFlowProvider } from './waterflow/FlowProvider';

provideFlowProvider(new FlowProvider)
</script>
