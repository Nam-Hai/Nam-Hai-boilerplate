<script setup lang="ts">
import OGLRenderer from '~/ogl.renderer/OGLRenderer.vue';
import Renderer from '~/ogl.renderer/OGLWrapper/Renderer.vue';

</script>
<template>
    <OGLRenderer>
        <Renderer>
            <Picker>
                <Plane :coord="{ x: -1, y: 0.5 }" />
                <Plane :coord="{ x: 0.5, y: -1 }" />
            </Picker>
        </Renderer>
    </OGLRenderer>
</template>