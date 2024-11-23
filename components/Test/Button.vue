<template>
    <div>

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

onMounted(() => {
    useDelay(() => {
        useFrame(()=>{
            console.log('test');
        })
    }, 1000)

})

watch(count, (v) => {
})
</script>

<style scoped>
button {
    font-size: 10rem;
    background-color: red;
}
</style>