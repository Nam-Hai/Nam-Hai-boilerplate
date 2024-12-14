<template>
    <h1>
        Level : {{ data }}
    </h1>
</template>

<script lang="ts" setup>
const { data } = await useFetch("/api/hello")
</script>

<style lang="scss" scoped>
h1 {}
</style>