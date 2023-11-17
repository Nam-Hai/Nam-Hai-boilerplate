<template>
    <main ref="mainRef">
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

.fps {
    font-size: 10rem;
    line-height: 100%;
}

main {
    top: 0;
    line-height: 100%;
}
</style>