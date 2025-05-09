<template>
    <OGLTransform ref="sceneRef">
        <slot />
    </OGLTransform>
</template>

<script lang="ts" setup>
import { Camera, Post, type Transform } from 'ogl';
import { shallowRef, type Ref } from 'vue';
import { provideCamera, useOGL } from '../useOGL';

const sceneRef = shallowRef() as Ref<Transform>
const { gl, renderer } = useOGL()
const camera = new Camera(gl)
provideCamera(camera)
camera.position.z = 5;
gl.clearColor(0, 0, 0, 0)

// const post = new Post(gl,)
useFrame(() => {
    renderer.render({
        scene: sceneRef.value,
        camera: camera
    })
})

useResize(({ vh, vw }) => {
    renderer.dpr = devicePixelRatio;
    renderer.setSize(vw, vh);

    camera.perspective({
        aspect: vw / vh,
    });
    const fov = (camera.fov * Math.PI) / 180;

    const z = vh / (2 * Math.tan(fov / 2));
    camera.position.z = z

    camera.perspective({ near: 0.1 * z / 5, far: 100 * z / 5 })
})

</script>
