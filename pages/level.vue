<template>
    <section>

        <h1>
            Level : {{ data }}
        </h1>

        <ul class="level-wrapper">
            <li v-for="level in data" @click="removeLevel(level.id)">
                {{ level.name }}
            </li>
        </ul>

        <button @click="() => addLevel()">add level named : {{ levelName }}</button>
        <input v-model="levelName">
    </section>
</template>

<script lang="ts" setup>

const { data, error } = await useAsyncData("levels", async () => {
    const rep = await $fetch("/api/getLevels")
    console.log(rep);
    // return ["test", "tt"]
    return rep
})
if (!data.value) throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
console.log(data.value);

const levelName = ref("")
const addLevel = async () => {
    if (levelName.value === "") return
    const levels = await $fetch("/api/addLevels", {
        query: {
            name: levelName.value
        }
    })
    levelName.value = ""

    data && data.value && (data.value = levels)
}
const removeLevel = async (id: number) => {
    // const levels = await fetchRemoveLevel(id)
    // data && data.value && (data.value = levels)
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