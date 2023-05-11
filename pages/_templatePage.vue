<template>
    <div ref="wrapperRef">

    </div>
</template>

<script lang="ts" setup>

const props = defineProps({})
const emits = defineEmits([])

const store = useStore()
const { $TL } = useNuxtApp()

const { client } = usePrismic()
const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

const wrapperRef = ref() as Ref<HTMLElement>


</script>

<style lang="scss" scoped></style>
