<template>
  <div ref="wrapperRef" class="wrapper-index">
    <img v-for="img in mediatest" :src='img.data.place.url' alt="">

  </div>
</template>

<script lang="ts" setup>
// HOW TO USE PRISMIC, LEGACY PRISMIC
// https://v3.prismic.nuxtjs.org/guides/basics/fetching-content
// https://prismic.io/docs/technical-reference/prismicio-client?utm_campaign=devexp&utm_source=nuxt3doc&utm_medium=doc
const { client } = usePrismic()
console.log(client);
const { data: mediatest } = await useAsyncData('mediatest', () => client.getAllByType('mediatest'))
console.log(mediatest.value);


const urlRef = ref([]) as Ref<Array<string>>
const { $lenis } = useNuxtApp()

const { $TL } = useNuxtApp()
const wrapperRef = ref()



onMounted(() => {
  $lenis.scrollTo('top')


  console.log(mediatest.value);
  for (const value of mediatest.value!) {
    console.log(value.data);
    urlRef.value.push(value.data.place.url)
  }
  nextTick().then(() => {
    $lenis.dimensions.onWindowResize()
    $lenis.dimensions.onContentResize()
  })
})



useRaf(() => {
})

</script>

<style lang="scss" scoped>
.wrapper-index {}
</style>
