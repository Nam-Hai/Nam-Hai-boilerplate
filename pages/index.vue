<template>
    <main ref="mainRef">
        <div class="fps">
            {{ fps }}
        </div>
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

const fps = ref(0)
useRaf(({ delta }) => {
    fps.value = Math.floor(1 / delta * 1000)
    // if(fps.value < 40) console.error("Frame droped")
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