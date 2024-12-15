<script lang="ts" setup>
import { Mesh, Plane, Program, Vec3 } from 'ogl';
import { useOGL } from '~/lib/webGL/ogl.renderer/useOGL';
import { basicVer } from '~/lib/webGL/scene/shaders/BasicVer';
import { getUId } from '~/lib/webGL/scene/utils/WebGL.utils';

const { coord = { x: 0, y: 0 } } = defineProps<{ coord?: { x: number, y: number } }>()
console.log(coord);

const { gl } = useOGL()

const geometry = new Plane(gl, {})

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform vec4 uId;

in vec2 vUv;
out vec4 FragColor[2];

void main() {
    vec4 color = vec4(0., 0., 1., 1.); 
    FragColor[0] = color;
    FragColor[1] = uId;
}
`

const { id, uId } = getUId()
const program = new Program(gl, {
    vertex: basicVer,
    fragment,
    uniforms: {
        uId: { value: uId }
    }
})



const instance = getCurrentInstance();
onMounted(() => {
    console.log(coord);
    console.log("Plane: ", instance);
    const mesh = new Mesh(gl, {
        program,

    })
});

</script>

<template>
    <OGLMesh :program="program" :geometry="geometry" :position="new Vec3(coord.x, coord.y, 0)">

    </OGLMesh>
</template>
