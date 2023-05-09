<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider } from './util/FlowProvider';

import index from '@/pages/index.vue';
import parallax from '@/pages/parallax.vue';
import useStore from './services/store';


const flowProvider = new FlowProvider()

provideFlowProvider(flowProvider)

flowProvider.registerPage('/', index)
flowProvider.registerPage('/parallax', parallax)

const store = useStore()
onMounted(() => {
  store.init()
})


</script>
