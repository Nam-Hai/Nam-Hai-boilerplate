
import { Program, Color } from 'ogl'

export type ProgramOptions = {
    vertex: string,
    fragment: string,
    uniforms: {
        [key: string]: { value: any }
    },
    transparent: boolean,
    cullFace: boolean |any,
    frontFace: any,
    depthTest: boolean,
    depthWrite: boolean,
    depthFunc: any
}
export default class NormalMaterial extends Program {
    uColor: Color
    constructor(gl: any, options: Partial<ProgramOptions> = {}) {
        super(gl, {
            fragment,
            vertex,
            uniforms: {
            }
        })
    }
}
const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;
out vec3 vNormal;

void main() {
  vNormal = normal;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;



const fragment = /* glsl */ `#version 300 es
precision highp float;

in vec3 vNormal;
out vec4 FragColor;

void main() {
  FragColor.rgb = (normalize(vNormal) + 1.) /2.;
  FragColor.a = 1.;
}
`