<template>
    <slot v-if="path == router.currentRoute.value.path" />
</template>

<script lang="ts" setup>
const { path } = defineProps<{ path: string }>()

const router = useRouter()

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;
</style>

