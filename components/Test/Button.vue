<template>
    <div ref="test">

        <button @click="onClick">TEST</button>
    </div>

</template>
<script setup lang="ts">
import { useTest } from "./testStore";

const onClick = () => {
    count.value++
}
const { count } = useTest()

const test = useTemplateRef("test")
useCleanScope(() => {
    console.log(test.value);
})


onMounted(() => {
    useDelay(() => {
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