<template>
    <slot />
</template>

<script setup lang="ts">
import Lenis from '@studio-freight/lenis';


const lenis = ref() as Ref<Lenis>;

onMounted(()=>{
    lenis.value= new Lenis({
        normalizeWheel: true,
    })
})

useRaf((e)=>{
    lenis.value.raf(e.elapsed)
})
</script>

<style scoped>
</style>