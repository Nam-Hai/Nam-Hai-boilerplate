<template>
    <div class="playground__wrapper" ref="wrapperRef">
        playground page
        <NuxtLink to="/">home</NuxtLink>



        <button @click="onClick(false)">MOVE</button>
        <button @click="onClick(true)">MOVE</button>
        <div class="box" ref="boxRef"></div>
    </div>

    <ComponentA />
</template>

<script lang="ts" setup>
const wrapperRef = shallowRef()

const boxRef = shallowRef()

function onClick(bol: boolean) {
    const motion = useSM({
        el: boxRef.value,
        p: {
            x: [0, Math.random() * 80, "rem"]
        },
        override: bol,
        d: 1500,
        e: "io2"
    })
    console.log(motion);
    motion.play()

}
// usePageFlow({
//     props: {
//         wrapperRef
//     }
// })
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.playground__wrapper {

    a {
        font-size: 5rem;
        line-height: 100%;
        padding: 2rem;
        color: red;
    }

    button {
        height: 5rem;
        width: 5rem;
        background: blue;
    }


    .box {
        height: 5rem;
        width: 5rem;
        background: red;
    }
}
</style>
