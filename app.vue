<template>
  <div id="app" v-if="cmsLoaded">
    <NuxtLayout v-if="!isMobile" name="default">
      <NuxtPage></NuxtPage>
    </NuxtLayout>
    <NuxtLayout v-else name="mobile">
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider } from '@nam-hai/water-flow';

import index from '@/pages/index.vue';

const isMobile = ref()
onBeforeMount(() => {
  isMobile.value = N.Snif.isMobile()
})

const flowProvider = new FlowProvider()

provideFlowProvider(flowProvider)
provide('from-preloader', { value: true })

flowProvider.registerPage('index', index)

const flowRef = ref(flowProvider)
flowProvider.addProps('flowRef', flowRef)

const store = useStore()
const cmsLoaded = ref(false)
const manifest = useManifest()

onMounted(async () => {
  manifest.loadCMS().then(() => {
    cmsLoaded.value = true
    store.initClient()
  })
})
</script>
