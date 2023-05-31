<template>
  <main ref="wrapperRef">

  </main>
</template>

<script lang="ts" setup>


const store = useStore()

store.resetLenis()

const wrapperRef = ref()

onMounted(() => {
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
}
</style>
