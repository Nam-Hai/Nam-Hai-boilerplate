<template>
    <main>
        foo
    </main>
</template>

<script setup lang="ts">
import { usePageFlow } from '~/lib/waterflow/composables/usePageFlow';

usePageFlow({
    props: {
    },
    flowIn: (props, res) => {
        res()
    },
    flowOut: (props, res) => {
        res()
    }
})
</script>

<style scoped lang="scss"></style>