<template>
    <div ref="wrapperRef">

        <div class="slice">
            <div class="screen__wrapper" ref="screenWrapperRef">
                <div ref="screen1Ref" class="screen screen-1">
                    <div class="cube" ref="cube1Ref">22</div>
                </div>
                <div ref="screen2Ref" class="screen screen-2">
                    <div class="cube" ref="cube2Ref">22</div>
                </div>
                <div ref="screen3Ref" class="screen screen-3">
                    <div class="cube" ref="cube3Ref">22</div>

                </div>
            </div>
        </div>
    </div>
    test
</template>

<script lang="ts" setup>
import { N } from '~/helpers/namhai-utils'


const props = defineProps({})
const emits = defineEmits([])

const store = useStore()
const { $TL } = useNuxtApp()

const wrapperRef = ref() as Ref<HTMLElement>

const screen1Ref = ref()
const screen2Ref = ref()
const screen3Ref = ref()
const screenWrapperRef = ref()

const cube1Ref = ref()
const cube2Ref = ref()
const cube3Ref = ref()
const cubeBound = reactive({
    x: 0,
    width: 0,
    rightPercent: 0,
    leftPercent: 0
})
onMounted(() => {
    const cubeBoundRect = cube1Ref.value.getBoundingClientRect()
    cubeBound.width = cubeBoundRect.width
    cubeBound.x = cubeBoundRect.x
    cubeBound.rightPercent = (cubeBound.x + cubeBound.width) / store.vw.value
    cubeBound.leftPercent = cubeBound.x / store.vw.value
})

usePin({
    el: screenWrapperRef,
    start: 0,
    end: 400,
    onProgress(t) {
        t = t * 4
        let t1 = N.Clamp(t, 0, 1)
        screenTranslate(t1, screen2Ref, cube1Ref, cube2Ref)
        let t2 = N.Clamp(t, 3, 4) - 3
        screenTranslate(t2, screen3Ref, cube2Ref, cube3Ref)
    },
})

function screenTranslate(t: number, el: Ref<HTMLElement>, cube?: Ref<HTMLElement>, cubeAfter?: Ref<HTMLElement>) {
    t = N.Ease.io1(t)
    N.T(el.value, (1 - t) * 100, 0)
    if (t == 0 || t == 1) return
    if (!cube) return
    let cubeT = N.Clamp(t, 1 - cubeBound.rightPercent, 1)
    cubeT = N.iLerp(cubeT, 1 - cubeBound.rightPercent, 1)
    N.T(cube.value, -cubeT * (cubeBound.x + cubeBound.width), 0, 'px')

    if (!cubeAfter) return
    let cubeAfterT = N.Clamp(t, 1 - cubeBound.leftPercent, 1)
    cubeAfterT = N.iLerp(cubeAfterT, 1 - cubeBound.leftPercent, 1)
    N.T(cubeAfter.value, -(1 - cubeAfterT) * cubeBound.x, 0, 'px')
}


</script>

<style lang="scss" scoped>
.slice {
    height: 500vh;
    width: 100vw;
    position: relative;
}

.screen__wrapper {
    position: relative;
    // height: 20vh;
    background-color: grey;
}

.screen {
    height: 100vh;
    width: 100vw;
    transform: translateX(100%);
    position: absolute;
    top: 0;
    left: 0;

    .cube {
        height: 20rem;
        width: 20rem;
        background-color: black;
        margin-left: 5rem;
        margin-top: 5rem;
        color: white;
        font-size: 20rem;
    }

    &.screen-1 {
        transform: translateX(0%);
        background-color: red;

    }

    &.screen-2 {
        // transform: translateX(30%);
        background-color: blue;
    }

    &.screen-3 {
        // transform: translateX(60%);
        background-color: green;
    }
}
</style>
