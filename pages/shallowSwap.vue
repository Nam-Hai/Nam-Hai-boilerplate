<template>
    <div ref="wrapperRef">

        test
        <div class="w1">
            <component :is="shallowRef1" />
        </div>
        <div class="w2">
            <component :is="shallowRef2" />
        </div>

    </div>
</template>

<script lang="ts" setup>
import Empty from '~/components/Empty.vue'
import EmptyRed from '~/components/EmptyRed.vue'


const props = defineProps({})
const emits = defineEmits([])

const store = useStore()
const { $TL } = useNuxtApp()

const wrapperRef = ref() as Ref<HTMLElement>

let shallowRef1 = shallowRef()
let shallowRef2 = shallowRef()

onMounted(() => {
    shallowRef1.value = Empty
    shallowRef2.value = EmptyRed

    nextTick()
    setTimeout(() => {
        let temp = shallowRef1
        shallowRef1 = shallowRef2
        shallowRef2 = temp
        console.log(shallowRef1.value, shallowRef2.value, 'shallow');
        nextTick()
    }, 200)
})

</script>

<style lang="scss" scoped>
.w1 {}
</style>
