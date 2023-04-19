<template>
    <TheWebGLScene />
    <TheBufferPage />
    <slot />
</template>

<script setup lang="ts">
// configure lenis in @/plugins/lenis.client.ts
const { $lenis } = useNuxtApp()

useRaf((e)=>{
    $lenis.raf(e.elapsed)
})
</script>

<style lang="scss" scoped>
</style>
