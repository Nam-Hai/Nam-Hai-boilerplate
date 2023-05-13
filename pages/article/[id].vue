<template>
    <div v-if="pending" style="font-size: 20rem;color: red">
        PENDING
    </div>
    <div v-else v-if="article" ref="wrapperRef">
        Titre : {{ article?.data.title }} {{ $route.params }}
        <NuxtLink to="/article/article-1">
            <div class="link">1</div>
        </NuxtLink>

        <NuxtLink to="/article/article-2">
            <div class="link">2</div>
        </NuxtLink>

        <NuxtLink to="/article/article-3">
            <div class="link">3</div>
        </NuxtLink>

        <NuxtLink to="/article/article-fdsfs">
            <div class="link">error</div>
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>


const store = useStore()
const { $TL } = useNuxtApp()

const route = useRoute()
// When accessing /posts/1, route.params.id will be 1
const { client } = usePrismic()
const { pending, data: article } = useLazyAsyncData('article' + route.params.id as string, () => client.getByUID('article', route.params.id as string))
if (!article.value) {
    navigateTo('/article')
}

const wrapperRef = ref() as Ref<HTMLElement>


</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

div {
    font-size: 10rem;
}

.link {
    font-size: 10rem;
}
</style>

