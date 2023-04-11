<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">

const { $RafR, $Raf } = useNuxtApp()

onMounted(()=>{
  console.log($Raf, $RafR);
})
</script>