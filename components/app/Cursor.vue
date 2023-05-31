<template>
    <div class="cursor__wrapper" ref="wrapperRef">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 20 20">
            <path d="M 0 5 A 1 1 0 0 0 0 -5 A 1 1 0 0 0 0 5 M 0 0 A 1 1 0 0 1 0 0 A 1 1 0 0 1 0 0" ref="pathRef" />
        </svg>
    </div>
</template>

<script lang="ts" setup>
import path from 'path';
import { Motion } from '~/plugins/core/motion';

// const {} = defineProps<{}>()
// const emits = defineEmits([])

const store = useStore()

const wrapperRef = ref() as Ref<HTMLElement>
const pathRef = ref() as Ref<HTMLElement>

const { mouse, cursorState } = useStore()

let motion: Motion;

watch(mouse, m => {
    N.T(wrapperRef.value, m.x, m.y, 'px')
})
watch(cursorState, (newState, oldState) => {
    N.Class.remove(wrapperRef.value, oldState)
    N.Class.add(wrapperRef.value, newState)


    let start = "M 0 5 A 1 1 0 0 0 0 -5 A 1 1 0 0 0 0 5 M 0 0 A 1 1 0 0 1 0 0 A 1 1 0 0 1 0 0"
    let end = "M 0 10 A 1 1 0 0 0 0 -10 A 1 1 0 0 0 0 10 M 0 -9 A 1 1 0 0 1 0 9 A 1 1 0 0 1 0 -9"
    if (newState == 'default') {
        const temp = start
        start = end
        end = temp
    }
    motion && motion.pause()
    motion = useMotion({
        el: pathRef.value,
        d: 250,
        e: 'io1',
        svg: {
            start,
            end
        },
    })
    motion.play()
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.cursor__wrapper {
    position: fixed;
    pointer-events: none;
    z-index: 2000;

    svg {
        position: absolute;
        transform: translate(-50%, -50%) scale(1);
        height: 5rem;
        width: 5rem;

        path {
            transition: fill 250ms;
            fill: $secondary
        }
    }

    &.active {
        .cursor {
            // transform: translate(-50%, -50%) scale(3);
        }
        svg > path {
            fill: '#ffffff'
        }
    }

    // .cursor {
    //     transition: transform 250ms;
    //     // width: 1.8rem;
    //     // height: 1.8rem;
    //     background-color: $secondary;
    //     transform: translate(-50%, -50%) scale(1);
    //     // border-radius: 50%;

    //     @include breakpoint(mobile) {
    //         width: 0.9rem;
    //         height: 0.9rem;
    //     }
    // }
}
</style>

