<template>
    <main ref="mainRef">
        <p v-cursor>
            hey this is my boilerplate™<br>
        </p>
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
main {
    font-size: 2rem;

    p {
        position: absolute;
        top: 14.2rem;
        left: 75rem;
        width: 41rem;
    }
}
</style>
