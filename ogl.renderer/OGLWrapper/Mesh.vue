<script lang="ts" setup>
import { Geometry, Mesh, Program, Plane } from 'ogl';
import { useOGL } from '../useOGL';

console.log("MESH");
const { gl } = useOGL()
console.log("MESH", gl);
const mesh = shallowRef()

useRaf((e) => {
  mesh.value.rotation.y = e.elapsed / 1000

  mesh.value.rotation.y = 2 * Math.cos(e.elapsed / 1000)
})

const program = new Program(gl, { vertex, fragment });
const plane = new Plane(gl);
</script>
<script lang="ts">
export const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;

export const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;

in vec2 vUv;
out vec4 FragColor;

void main() {
//   vec4 color = texture(tMap, vUv);
    vec4 color = vec4(1., 0., 0., 1.);
    FragColor = color;
}
`
// export { program, plane, fragment. }
</script>

<template>
  <OGLMesh ref="mesh" :program="program" :geometry="plane">
    <slot />
  </OGLMesh>
</template>