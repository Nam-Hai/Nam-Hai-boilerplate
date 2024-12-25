<template>
    <main>
        <h1>
            BLOG
        </h1>
        <ul class="cat__wrapper">
            <li class="cat-item__wrapper" v-for="category in categories" :key="category.id">
                {{ category.name }}

                <button @click="deleteCategory(category)">delete</button>
            </li>
            <li>
                <input v-model="categoryNameInput" type="text"> <button @click="createNewCategory()">+</button>
            </li>
        </ul>
    </main>
</template>

<script setup lang="ts">
import type { Category } from '~/server.bun/prisma/generated/zod'


const { data } = await useAsyncData("categories", async () => {
    const payload = await fetchToMiddleware("/api/getCategories", {})
    return payload
})
if (!data.value) createError("yooo")
const categories = data.value!.categories
const categoryNameInput = ref("")

const createNewCategory = async () => {
    const payload = { name: categoryNameInput.value }
    try {
        const cat = await fetchToMiddleware("/api/createCategory", payload)
        categories.push(cat)
        categoryNameInput.value = ""
    } catch {

    }
}

const deleteCategory = async (category: Category) => {
    const cat = await fetchToMiddleware("/api/deleteCategory", { id: category.id })
    const { index, miss } = N.binarySearch(categories, cat.id)
    if (miss) return
    categories.splice(index, 1)
}
</script>

<style scoped lang="scss">
ul {
    display: flex;
    flex-direction: column;

    width: 50rem;
    padding: 10rem 4rem;
    background-color: beige;

    row-gap: 1rem;
}

input {
    border-radius: 0.2rem;
}
</style>