<template>
    <div ref="wrapperRef">
        l'article n'existe pas
    </div>

    <NuxtLink to="/article/article-1"></NuxtLink>
    <NuxtLink to="/article/article-2"></NuxtLink>
    <NuxtLink to="/article/article-3"></NuxtLink>
</template>

<script lang="ts" setup>

const store = useStore()
const { $TL } = useNuxtApp()

const { client } = usePrismic()

const wrapperRef = ref() as Ref<HTMLElement>


</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;
</style>

