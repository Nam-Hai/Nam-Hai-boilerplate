<template>
    <main ref="mainRef">
    </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/lib/waterflow/composables/usePageFlow';


const mainRef = shallowRef()

usePageFlow({
    props: {
        mainRef
    },
    flowIn: (props, res) => {
        res()
    },
    flowOut: (props, res) => {
        res()
    }
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;
</style>
