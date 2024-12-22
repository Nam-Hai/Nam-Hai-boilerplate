<template>
    <main ref="mainRef">
        <h1>Index</h1>
        <p v-cursor>
            hey this is my boilerplate™<br>
            {{ lorem }}
        </p>
    </main>
</template>

<script lang="ts" setup>
import { lorem } from '~/assets/lorem';
import { usePageFlow } from '~/lib/waterflow/composables/usePageFlow';
import { useDefaultFlowIn, useDefaultFlowOut } from '~/pages.transition/defaultFlow';

const main = useTemplateRef("mainRef")

usePageFlow({
    props: {
        main
    },
    flowIn: useDefaultFlowIn(),
    flowOut: useDefaultFlowOut()
})

</script>

<style lang="scss" scoped></style>
