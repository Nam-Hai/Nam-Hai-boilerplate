<template>
  <NuxtLayout>
    <!-- <NuxtPage /> -->
    <CustomRouter />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { provideStoreCursor } from './composables/useStore';
import { provideStoreView } from './composables/useStoreView';
import { useOGL } from './ogl.renderer/useOGL';
import CustomRouter from './waterflow/CustomRouter.vue';
import { provideFlowProvider } from './waterflow/FlowProvider';

provideFlowProvider({})
provideStoreView({})
provideStoreCursor({})


</script>
