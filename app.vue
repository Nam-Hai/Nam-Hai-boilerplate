<template>
  <div id="app" v-if="waitBeforeMount">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
    
  </div>
</template>

<script setup lang="ts">
import { FlowProvider, provideFlowProvider } from './waterflow/FlowProvider';
import Index from './pages/index.vue';
import Playground from './pages/playground.vue';

const flowProvider = new FlowProvider()
provideFlowProvider(flowProvider)

flowProvider.registerPage('index', Index)
flowProvider.registerPage('playground', Playground) 

const flowRef = ref(flowProvider)
flowProvider.addProps('flowRef', flowRef)

const matcher = window.matchMedia('(prefers-color-scheme: dark)');
if (matcher.matches) {
  const els = N.getAll('link.light')
  for (const el of els) {
    el.remove()
  }
} else {
  const els = N.getAll('link.dark')
  for (const el of els) {
    el.remove()
  }
}

let waitBeforeMount = ref(false)

onBeforeMount(() => {
  useStore().init()

  waitBeforeMount.value = true
})

onMounted(() => {
})
</script>
