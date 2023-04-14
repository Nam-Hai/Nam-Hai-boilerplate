<template>
    <div class="wrapper">
        <div></div>
        <div ref="pinRef"></div>

        <TestComponent />
        <div v-for="i in 20">
            22
        </div>
        <div ref="testRef" >
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


const {$TL} = useNuxtApp()
const testRef = ref() as Ref<HTMLElement>
const pinRef = ref() as Ref<HTMLElement>

useScrollEvent({
    el: testRef,
    vStart: 80,
    eStart: 0,
    onEnter: ()=>{
        console.log('onenter');
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
    onProgress: (t)=>{
        testRef.value.innerText = N.Round(t * 100, 0) + '%'
    }
})

</script>

<style lang="scss" scoped>
.wrapper {
    color: white;
    font-size: 10rem;
     div {
        display: flex;
        align-items: center;
        height: 20rem;
        width: 100vw;
    }

    div:nth-child(4n){
        background-color: aquamarine;
    }
    div:nth-child(4n + 1){
        background-color: blue;
    }
    div:nth-child(4n + 3){
        background-color: red;
    }
    div:nth-child(4n + 2){
        background-color: black;
    }
}
</style>
