<template>
    <main ref="mainRef">
        <h1>Index</h1>
        <p>
            hey this is my boilerplate™<br>
            {{ lorem }}
        </p>
    </main>
</template>

<script lang="ts" setup>
import { lorem } from '~/assets/lorem';
import { useDefaultFlow } from '~/pages.transition/defaultFlow';


const main = useTemplateRef("mainRef")
useDefaultFlow(main)

</script>

<style lang="scss" scoped>
main {
    height: 900vh;
}
</style>
