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
        console.log('delay 1');
        const tl = getFilm()
        tl.from({
            el: test.value!,
            d: 1000,
            p: {
                o: [1, 0]
            }
        })
        tl.from({
            el: test.value!,
            d: 1000,
            delay: 200,
            p: {
                x: [0, 100]
            }
        })
        tl.play()
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