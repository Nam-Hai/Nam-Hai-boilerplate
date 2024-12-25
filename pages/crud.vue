<template>
    <main>
        <h1>
            BLOG
        </h1>
        <ul class="cat__wrapper">
            <li class="cat-item__wrapper" v-for="category in categories">
                {{ category.name }}

            </li>
            <li><input type="text"> + </li>
        </ul>
    </main>
</template>

<script setup lang="ts">

const { data } = await useAsyncData("categories", async () => {
    const payload = await $fetch("/api/getCategories")
    console.log(payload);
    return payload
})
if (!data.value) createError("yooo")
const categories = data.value
console.log(data.value);

const createNewCategory = () => {

}
</script>

<style scoped lang="scss"></style>