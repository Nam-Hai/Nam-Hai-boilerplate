<template>
    <div class="playground__wrapper" ref="wrapperRef">
        playground page
        <NuxtLink to="/">home</NuxtLink>
    </div>

    <ComponentA />
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const wrapperRef = shallowRef()

usePageFlow({
    props: {
        wrapperRef
    }
})
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.playground__wrapper {

    a {
        font-size: 5rem;
        line-height: 100%;
        padding: 2rem;
        color: red;
    }
}
</style>
