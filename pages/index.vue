<template>
    <main ref="mainRef">
        Nuxt Boiler plate
    </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';
import { defaultFlowIn, defaultFlowOut } from './default.transition';



const mainRef = ref()

useResetLenis({
    infinite: false,
    direction: "vertical"
})




usePageFlow({
    props: {},
    flowOut: defaultFlowOut,
    flowInCrossfade: defaultFlowIn,
    enableCrossfade: 'BOTTOM'
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
    top: 0;
    line-height: 100%;
}
</style>