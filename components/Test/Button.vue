<template>
    <div ref="test">

        <button @click="onClick">TEST</button>
    </div>

</template>
<script setup lang="ts">
import { useTest } from "./testStore";

const onClick = () => {
    // on.value = !on.value

    count.value++
    // console.log(computedOn.value, count.value);
}
const { count } = useTest()


// const computedOn = computed(() => {
//     const a = count.value + 2

//     useRaf(() => {
//         console.log("test", a);
//     })

//     return a
// })
const test = useTemplateRef("test")
useCleanScope(() => {
    console.log(test.value);
})
// useFrame(()=>{
//     console.log('test');
// })
// console.log(window, document);
onMounted(() => {
    useCleanScope(() => {
        console.log('onMounter test');
    })
})
// getFrame(()=>{
//     console.log('test', document);
// }).run()

onMounted(() => {
    useDelay(() => {
        console.log('delay 1');
        useDelay(() => {
            console.log('delay 2');
            useFrame(() => console.log('test'))

        }, 2000)
    }, 1000)
})

watch(count, (v) => {
    useCleanScope(() => {
        console.log("watch immeditate test");
    })
}, { immediate: true })
</script>

<style scoped>
button {
    font-size: 10rem;
    background-color: red;
}
</style>