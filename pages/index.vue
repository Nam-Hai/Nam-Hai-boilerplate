<template>
    <main ref="mainRef">
        index page
        <NuxtLink to="/playground">playground</NuxtLink>
    </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const mainRef = shallowRef()

usePageFlow({
    props: {
        mainRef
    }
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
