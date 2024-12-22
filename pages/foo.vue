<template>
    <main ref="main">
        <h1>foo</h1>
        <FooUnique />
        <p>
            foo <br>
            {{ lorem }}
        </p>
    </main>
</template>

<script setup lang="ts">
import { lorem } from '~/assets/lorem';
import { usePageFlow } from '~/lib/waterflow/composables/usePageFlow';
import { useDefaultFlowIn, useDefaultFlowOut } from '~/pages.transition/defaultFlow';

const { vh, scale } = useScreen()
onMounted(() => {
    console.log(vh.value);

})
const main = useTemplateRef("main")
usePageFlow({
    props: {
        main
    },
    flowOut: useDefaultFlowOut(),
    flowIn: useDefaultFlowIn(),
})
</script>

<style scoped lang="scss">
main {}
</style>