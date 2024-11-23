<template>
    <button @click=" on = !on">TEST : {{ on }}</button>

    <button @click="count++">
        count {{ count }}
    </button>
    <TestButton v-if="on" />
</template>
<script setup lang="ts">
import { provideTest } from './testStore';

const on = ref(false)

const { count } = provideTest({})
</script>

<style scoped>
button {
    font-size: 10rem;
    background-color: blue;
}
</style>