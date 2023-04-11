<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">

const { $RafR, $Raf } = useNuxtApp()

// onMounted(()=>{
//   const raf = new $RafR(()=>{
//     console.log('objectt');
//   })
//   raf.run()
// })
const raf = useRaf(()=>{
  console.log('object2');
})
</script>