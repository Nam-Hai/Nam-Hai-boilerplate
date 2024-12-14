<template>
    <section>

        <h1>
            Level : {{ data?.data.levels }}
        </h1>

        <button @click="() => addLevel()">add level named : {{ levelName }}</button>
        <input v-model="levelName">
    </section>
</template>

<script lang="ts" setup>
const { data } = await useFetch("/api/hello")

const levelName = ref("")
const addLevel = async () => {
    console.log('test');
    const a =  await $fetch("/api/addLevels", {
        query: {
            name: levelName.value
        }
    })
}


</script>

<style lang="scss" scoped>
h1 {}

section {
    z-index: 200;
    position: relative;
}

button {
    font-size: 6rem;
    margin: 2rem;
}

input {
    font-size: 10rem;
    background-color: red;
}
</style>