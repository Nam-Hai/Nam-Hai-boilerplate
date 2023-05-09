<template>
  <div ref="wrapperRef" class="wrapper">
    <img v-for="url in urlRef" :src="url" alt="">
    <NuxtLink to='/parallax'>
      <div></div>
    </NuxtLink>
    <div ref="pinRef"></div>

    <TestComponent />
    <div v-for="i in 90">
      22
    </div>
    <div ref="testRef">
      test
    </div>

    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>

  </div>
</template>

<script lang="ts" setup>
import { N } from '~/helpers/namhai-utils';
import { IndexTransitionOutMap, IndexTransitionCrossfadeMap } from '@/pages/index.transitions';
import { usePageFlow } from '@nam-hai/water-flow'


// HOW TO USE PRISMIC, LEGACY PRISMIC
// https://v3.prismic.nuxtjs.org/guides/basics/fetching-content
// https://prismic.io/docs/technical-reference/prismicio-client?utm_campaign=devexp&utm_source=nuxt3doc&utm_medium=doc
const { client } = usePrismic()

const urlRef = ref([]) as Ref<Array<string>>
const { $lenis } = useNuxtApp()

const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

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

// onUpdated(()=>{
//   $lenis.dimensions.onWindowResize()
//   $lenis.dimensions.onContentResize()
// })

const store = useStore()

useRaf(() => {
})

const { $TL } = useNuxtApp()
const testRef = ref() as Ref<HTMLElement>
const pinRef = ref() as Ref<HTMLElement>

const wrapperRef = ref()


useScrollEvent({
  el: testRef,
  vStart: 80,
  eStart: 0,
  onEnter: () => {
    let tl = new $TL()
    tl.from({
      el: testRef.value,
      p: {
        x: [-100, 0]
      },
      d: 2000,
      e: 'io3'
    }).play()
  },
  onProgress: (t) => {
    testRef.value.innerText = N.Round(t * 100, 0) + '%'
  }
});

usePageFlow({
  props: {
    wrapperRef
  },
  flowOutMap: IndexTransitionOutMap,
  flowInCrossfadeMap: IndexTransitionCrossfadeMap,
  enableCrossfade: true
})


</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  color: white;
  font-size: 10rem;
  z-index: 2;

  div {
    display: flex;
    align-items: center;
    height: 5rem;
    width: 100vw;
  }

  div:nth-child(4n) {
    background-color: aquamarine;
  }

  div:nth-child(4n + 1) {
    background-color: blue;
  }

  div:nth-child(4n + 3) {
    background-color: red;
  }

  div:nth-child(4n + 2) {
    background-color: black;
  }
}
</style>
