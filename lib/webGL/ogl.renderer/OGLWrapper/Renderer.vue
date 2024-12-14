<script lang="ts" setup>
import { Camera, Renderer, type Transform } from 'ogl';
import { onMounted, shallowRef, type Ref } from 'vue';
import { provideCamera, useOGL } from '../useOGL';

const sceneRef = shallowRef() as Ref<Transform>
const { gl, renderer } = useOGL()
console.log("Renderer.vue", gl);


const camera = new Camera(gl)
provideCamera(camera)
camera.position.z = 5;
gl.clearColor(0, 0, 0, 0)


useRaf(() => {
    renderer.render({
        scene: sceneRef.value,
        camera: camera
    })
})

useRO(({ vh, vw }) => {
    renderer.dpr = devicePixelRatio;
    renderer.setSize(vw, vh);

    camera.perspective({
        aspect: vw / vh,
    });
    // const fov = (camera.fov * Math.PI) / 180;

    // const height = 2 * Math.tan(fov / 2) * camera.position.z;

    // size.value = {
    //     height,
    //     width: height * camera.aspect,
    // };
})

</script>
<template>
    <OGLTransform ref="sceneRef">
        <slot />
    </OGLTransform>
</template>