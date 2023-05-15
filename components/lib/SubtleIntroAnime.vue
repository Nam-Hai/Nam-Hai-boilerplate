<template>
    <div ref="wrapperRef" style="opacity: 0;">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { onFlow } from '@nam-hai/water-flow'
import { EaseFunctionName } from '~/plugins/core/eases'

const { duration = 500, x = 2, y = 0, delay = 0, e = 'linear'} = defineProps<{
    duration?: number,
    x?: number,
    y?: number,
    delay?: number,
    e?: EaseFunctionName
}>()

onFlow(() => {
    useTL().from({
        el: wrapperRef.value,
        d: duration,
        delay,
        e,
        p: {
            o: [0, 1],
            x: [x, 0, 'rem'],
            y: [y, 0, 'rem']
        },
    }).play()
})

const wrapperRef = ref() as Ref<HTMLElement>

</script>


