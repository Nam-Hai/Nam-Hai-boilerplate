<template>

    <Plane :coord="{ x: 0, y: 0 }" />

</template>
<script lang="ts" setup>
import Plane from '../webGL/Plane.vue';
import { useOGL } from '~/lib/webGL/ogl.renderer/useOGL';
import { WebGLVideoDecoder } from "./VideoDecoder"

const { gl } = useOGL()



</script>
