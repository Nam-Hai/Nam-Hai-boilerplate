<script lang="ts" setup>
import { onMounted, shallowRef } from 'vue';
import { useOGL } from '../useOGL';
import { Camera, Geometry, Plane, Program, Transform } from 'ogl';
import Mesh, { fragment, vertex } from './Mesh.vue'
import Renderer from './Renderer.vue';
import type { FrameEvent } from '~/plugins/core/frame';
import { useFlowProvider } from '~/waterflow/FlowProvider';

const flowProvider = useFlowProvider()
console.log(flowProvider);
const { renderer, gl } = useOGL()

const mesh = shallowRef()

useFrame((e: FrameEvent) => {
    console.log("canvas");
    mesh.value.position.set(2 * Math.cos(e.elapsed / 200), 0, 0)
})

const program = new Program(gl, { vertex, fragment });
const plane = new Plane(gl);
</script>
<template>
    <Renderer>
        <Mesh>
            <OGLMesh ref="mesh" :program="program" :geometry="plane">
                <OGLTransform />
            </OGLMesh>
        </Mesh>
    </Renderer>
</template>