<template>
  <div ref="wrapperRef" class="wrapper">
    <NuxtLink to='/parallax'>
      <div></div>
    </NuxtLink>
    <div ref="pinRef"></div>

    <TestComponent />
    <div v-for="i in 20">
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
import { IndexTransitionProps, IndexTransitionOutMap, IndexTransitionCrossfadeMap } from '@/pages/index.transitions';

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

usePageTransition({
  props: {
    wrapperRef
  },
  transitionOutMap: IndexTransitionOutMap,
  transitionInCrossfadeMap: IndexTransitionCrossfadeMap,
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
    height: 20rem;
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
