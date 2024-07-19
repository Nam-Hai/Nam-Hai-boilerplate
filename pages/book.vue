<template>
    <div class="playground__wrapper">
        book page
        <NuxtLink to="/">home</NuxtLink>
    </div>

    <ComponentA />
</template>

<script lang="ts" setup>

// function raf() {

//     console.log('test');
//     requestAnimationFrame(raf)
// }
// raf()
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.playground__wrapper {

    a {
        font-size: 5rem;
        line-height: 100%;
        padding: 2rem;
    }
}
</style>
