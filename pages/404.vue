<template>
    <div ref="wrapperRef">

        404
    </div>
</template>

<script lang="ts" setup>

const store = useStore()
const { $TL } = useNuxtApp()

const { client } = usePrismic()
const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

const wrapperRef = ref() as Ref<HTMLElement>


</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

</style>

