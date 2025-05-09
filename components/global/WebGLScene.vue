<script setup lang="ts">
import type { WebGLIndexWebGL } from '#build/components';
import OGLRenderer from '~/lib/webGL/ogl.renderer/OGLRenderer.vue';
import Renderer from '~/lib/webGL/ogl.renderer/OGLWrapper/Renderer.vue';

</script>
<template>
    <OGLRenderer>
        <Renderer>
            <WebGLIndexWebGL />
            <!-- <Picker> -->
            <!-- <Plane :coord="{ x: -1, y: 0.5 }" /> -->
            <!-- <Plane :coord="{ x: 0.5, y: -1 }" /> -->
            <!-- </Picker> -->
        </Renderer>
    </OGLRenderer>
</template>
