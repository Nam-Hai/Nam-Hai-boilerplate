<template>
    <div class="wrapper">
        <div ref="ref1"></div>
        <div ref="ref2"></div>
        <div ref="ref3"></div>
        <div></div>
        <div></div>
    </div>
</template>

<script setup lang="ts">
import { N } from '~/helpers/namhai-utils';

const ref1 = ref()
const ref2 = ref()
const ref3 = ref()

onMounted(()=>{
})

const paralax = (el:Ref<HTMLElement>, amount: number)=>{
  useScrollProgression({
    el: el,
    vStart: 100,
    end: 0,
    onProgress: (t)=>{
      N.T(el.value, 0, (1 - amount) * t * 100, 'vh')
    }
  })
}
paralax(ref1, 1.09)
paralax(ref2, 1.1)
paralax(ref3, 1.05)

</script>

<style lang="scss">
.wrapper {
  display: flex;
  column-gap: 1rem;
  height: 800rem;
  margin-top: 170rem;
  
  
  div {
    width: 15rem;
    height: 15rem;

    &:nth-child(4n){
      background: red;
    }
    &:nth-child(4n + 1){
      background: blue;
    }
    &:nth-child(4n + 2){
      background: crimson;
    }
    &:nth-child(4n + 3){
      background-color: green;
    }
  }
}
</style>
