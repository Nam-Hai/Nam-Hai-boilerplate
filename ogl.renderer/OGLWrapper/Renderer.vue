<script lang="ts" setup>
import { Camera, Renderer, type Transform } from 'ogl';
import { onMounted, shallowRef, type Ref } from 'vue';
import { provideCamera, useOGL } from '../useOGL';
import { useFlowProvider } from '~/waterflow/FlowProvider';

const ctx = getCurrentInstance()?.appContext
onMounted(() => {
    console.log("RENDERER ON MOUNTED");
    const instance = getCurrentInstance();
    const parent = instance?.proxy?.$parent;
    console.log(instance, parent);

    useDelay(4000, () => {
        testRef.value = Math.random()
    })

    if (parent) {
        console.log('Parent component:', parent);
        // You can access properties and methods of the parent component here
    } else {
        console.log('No parent component found.');
    }
    const flow = useFlowProvider()
    console.error(flow);
});

const sceneRef = shallowRef() as Ref<Transform>
console.log("Renderer.vue", ctx);
const { gl, renderer, testRef } = useOGL()
console.log("Renderer.vue", gl);

watch(testRef, (val) => {
    console.log(val);
}, { immediate: true })

const camera = new Camera(gl)
provideCamera(camera)
camera.position.z = 5;
gl.clearColor(0, 0, 1, 1)


useRaf(() => {
    renderer.render({
        scene: sceneRef.value,
        camera: camera
    })
})

</script>
<template>
    <OGLTransform ref="sceneRef">
        <slot />
    </OGLTransform>
</template>