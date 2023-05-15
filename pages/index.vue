<template>
  <main ref="wrapperRef">
    Index Page
  </main>
</template>

<script lang="ts" setup>



const { client } = usePrismic()
const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))
const store = useStore()

store.resetLenis()

const wrapperRef = ref()


</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

</style>
