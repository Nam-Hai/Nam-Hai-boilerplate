<script lang="ts" setup>
import { useOGL } from '~/ogl.renderer/useOGL';

const wrapperRef = ref() as Ref<HTMLElement>

const { gl, renderer } = useOGL()

</script>

<template>
    <slot />
</template>