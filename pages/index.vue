<template>
    <main ref="mainRef">
        index page
        <NuxtLink to="/playground">playground</NuxtLink>
    </main>
</template>

<script lang="ts" setup>
import { delay } from '~/plugins/core/raf';

const mainRef = shallowRef()

const router = useRouter()

const routerGuard = router.beforeEach(async (to, from, next) => {

    console.log("index beforeEach");
    await delay(1500)
    next()
})

onUnmounted(() => {
    routerGuard()
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
    top: 0;
    line-height: 100%;
    font-size: 20rem;

    a {
        font-size: 5rem;
        line-height: 100%;
        padding: 2rem;
    }
}
</style>
