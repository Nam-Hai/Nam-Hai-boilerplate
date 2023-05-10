<template>
  <div ref="wrapperRef" class="wrapper-index">
  </div>
</template>

<script lang="ts" setup>
// HOW TO USE PRISMIC, LEGACY PRISMIC
// https://v3.prismic.nuxtjs.org/guides/basics/fetching-content
// https://prismic.io/docs/technical-reference/prismicio-client?utm_campaign=devexp&utm_source=nuxt3doc&utm_medium=doc
const { client } = usePrismic()

const urlRef = ref([]) as Ref<Array<string>>
const { $lenis } = useNuxtApp()

const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))
const store = useStore()
const { $TL } = useNuxtApp()
const wrapperRef = ref()

onMounted(async () => {
  $lenis.scrollTo('top')
  for (const value of media.value!) {
    console.log(value.data.place);
    urlRef.value.push(value.data.place.url)
  }
  nextTick()

  $lenis.dimensions.onWindowResize()
  $lenis.dimensions.onContentResize()
})



useRaf(() => {
})

</script>

<style lang="scss" scoped>
.wrapper-index {
}
</style>
