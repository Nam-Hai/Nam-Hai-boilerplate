<template>
  <div ref="wrapperRef">
  <NuxtLink to='/'>
    <div class="home" ref="buttonRef">
    </div>
  </NuxtLink>

  <div class="mire"></div>
  <div class="wrapper">
    <TheParallax :amount="1.2">
      <div></div>
    </TheParallax>
    <TheParallax :amount="0.9">
      <div></div>
    </TheParallax>
    <TheParallax :amount="1.1">
      <div></div>
    </TheParallax>
    <div ref="pinRef">
      <div ref="layerRef" class="layer-blue"></div>
      <span ref="textRef" style="position: relative;">test</span>
    </div>
    <div ref="rotateRef"></div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { N } from '~/helpers/namhai-utils';

const { $TL } = useNuxtApp()

const buttonRef = ref()

const wrapperRef = ref()


onMounted(() => {
})

const pinRef = ref()
const layerRef = ref()
const textRef = ref()
const rotateRef = ref()



usePin({
  el: pinRef,
  start: 50,
  end: 300,
  eStart: 50,
  onProgress: (t) => {
    N.O(layerRef.value, t)
    textRef.value.innerText = N.Round(t * 100, 0) + '%'
  },
})

useScrollEvent({
  el: rotateRef,
  vStart: 50,
  eStart: 50,
  onEnter: () => {
    let tl = new $TL();
    tl.from({
      el: rotateRef.value,
      p: {
        r: [0, 2 * 180],
        s: [1, 0.7]
      },
      d: 1000,
      e: 'io2'
    })
    tl.play()
  }
})


usePageTransition({
  wrapperRef,
  props: {
    buttonRef,
    wrapperRef
  },
  enableCrossfade: 'TOP',
  transitionOut: ({ }, { canvas }, resolve) => {
    let cubePosScale = canvas.value.mesh.scale
    let scaleTo = (Math.random() + 0.3) * 1.2
    let tl = new $TL()
    tl.from({
      d: 1000,
      e: 'io2',
      update: (e) => {
        if (!canvas) return
        let s = N.Lerp(cubePosScale[0], scaleTo, e.progE)
        canvas.value.mesh.scale.set(s, s, s)
      },
      cb: () => {
        resolve()
      }
    }).play()
  },
  transitionInCrossfade: ({ buttonRef }, { }, resolve) => {
    let tl = new $TL()
    tl.from({
      el: buttonRef.value,
      d: 1000,
      e: 'io2',
      p: {
        x: [100, 0]
      },
      cb: () => {
        resolve()
      }
    }).play()
  },
  // transitionIn: ({ buttonRef }, { }, resolve) => {
  //   let tl = new $TL()
  //   tl.from({
  //     el: buttonRef.value,
  //     d: 1000,
  //     e: 'io2',
  //     p: {
  //       r: [0, 180]
  //     },
  //     cb: () => {
  //       resolve()
  //     }
  //   }).from({
  //     el: wrapperRef.value,
  //     d: 250,
  //     p: {
  //       o: [0, 1],
  //     },
  //   }).play()
  // }
})

</script>

<style lang="scss" scoped>
.home {
  position: fixed;
  right: 4rem;
  top: 4rem;
  width: 7rem;
  height: 4rem;
  background: red;
  z-index: 2;
}

.layer-blue {
  width: 100%;
  height: 100%;
  background: pink;
  position: absolute;
}

.mire {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &::after {
    content: '';
    height: 2px;
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: black;

  }
}

.wrapper {
  position: relative;
  display: flex;
  column-gap: 1rem;
  height: 800rem;
  margin-top: 170rem;


  >div {
    width: 15rem;
    height: 15rem;
    display: flex;
    align-items: center;
    font-size: 5rem;
    justify-content: center;

    &:nth-child(4n) {
      background: red;
    }

    &:nth-child(4n + 1) {
      background: blue;
    }

    &:nth-child(4n + 2) {
      background: crimson;
    }

    &:nth-child(4n + 3) {
      background-color: green;
    }
  }
}
</style>
