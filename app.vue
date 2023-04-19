<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import  parallax  from '@/pages/parallax.vue';
import { createApp } from 'vue'
import { FlowProvider, provideFlowProvider } from './util/FlowProvider';


const app = createApp({})

app.component('parallax', parallax)

const flowProvider = new FlowProvider()
provideFlowProvider(flowProvider)



</script>
