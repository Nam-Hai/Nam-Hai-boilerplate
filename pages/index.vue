<template>
    <div class="wrapper">
        <div></div>
        <div></div>
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
    </div>
</template>

<script lang="ts" setup>

const {$TL} = useNuxtApp()
const testRef = ref() as Ref<HTMLElement>

useScrollEvent({
    el: testRef,
    vStart: 80,
    eStart: 100,
    onEnter: ()=>{
       let tl = new $TL() 
       tl.from({
        el: testRef.value,
        p: {
            x: [-100, 0]
        },
        d: 2000,
        e: 'io3'
       }).play()
    }
})

</script>

<style lang="scss" scoped>
.wrapper {
    color: white;
    font-size: 10rem;
    > div {
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