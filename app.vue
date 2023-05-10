<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider } from '@nam-hai/water-flow';

import index from '@/pages/index.vue';
import parallax from '@/pages/parallax.vue';


const flowProvider = new FlowProvider()

provideFlowProvider(flowProvider)
provide('from-preloader', { value: true })

flowProvider.registerPage('index', index)
flowProvider.registerPage('parallax', parallax)

const flowRef = ref(flowProvider)
flowProvider.addProps('flowRef', flowRef)

const store = useStore()
onMounted(() => {
  store.init()
})


</script>
