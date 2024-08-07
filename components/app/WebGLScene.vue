<script setup lang="ts">
import OGLRenderer from '~/ogl.renderer/OGLRenderer.vue';
import Mesh from '~/ogl.renderer/OGLWrapper/Mesh.vue';
import Renderer from '~/ogl.renderer/OGLWrapper/Renderer.vue';

</script>
<template>
    <OGLRenderer>
        <Renderer>
            <Mesh>
            </Mesh>
        </Renderer>
    </OGLRenderer>
</template>