<template>
    <main ref="main">
        <h1>foo</h1>
        <p>
            {{ lorem }}
        </p>
    </main>
</template>

<script setup lang="ts">
import { lorem } from '~/assets/lorem';
import { useDefaultFlow } from '~/pages.transition/defaultFlow';

const main = useTemplateRef("main")
useDefaultFlow(main)
</script>

<style scoped lang="scss">
main {
    background-color: darkcyan;
}
</style>