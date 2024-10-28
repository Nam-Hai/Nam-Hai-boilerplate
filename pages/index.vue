<template>
    <main ref="mainRef">
        <p>
            hey this is my boilerplate™<br>
            I use Nuxt and a lot custom tools. Some of this is a bit useless maybe. Maybe you should not use my
            animation engine as there are more robust already existing tools like gsap or animejs. The frame manager and
            the resize manager are cool tho.<br>
            <NuxtLink to="https://github.com/Nam-Hai/Nam-Hai-boilerplate" target="_blank" rel="noopener noreferrer">
                Click here
            </NuxtLink>
        </p>
    </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

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
