<template>
    <button @click="count++">
        Foo button {{ count }}
    </button>
</template>
<script setup lang="ts">

const count = ref(0)
</script>

<style scoped lang="scss"></style>