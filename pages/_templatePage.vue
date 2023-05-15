<template>
    <div ref="wrapperRef">

    </div>
</template>

<script lang="ts" setup>

const store = useStore()

// const { client } = usePrismic()
// const { data: media } = await useAsyncData('media', () => client.getAllByType('mediatest'))

const wrapperRef = ref() as Ref<HTMLElement>


</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

</style>
