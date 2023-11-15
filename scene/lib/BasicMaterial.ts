
import { Texture, Program, Color } from 'ogl'
import { basicVer } from '../shaders/BasicVer'
import type { ProgramOptions } from './NormalMaterial'
import { loadTexture } from '../utils/WebGL.utils'

export class BasicMaterial extends Program {
    uColor: Color
    tMap: any
    constructor(gl: any, options: Partial<ProgramOptions & { color: any, tMap: string }> = {}) {
        const uColor = ref(new Color(options.color))
        const tMap = ref(new Texture(gl))

        if (options.tMap) {
            loadTexture(tMap.value, options.tMap)
        }

        super(gl, {
            fragment,
            vertex: basicVer,
            uniforms: {
                uColor,
                tMap
            }
        })

        this.tMap = tMap
        this.uColor = uColor
    }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec3 uColor;

in vec2 vUv;
out vec4 FragColor;

void main() {
  FragColor.rgb = uColor;
  FragColor.rgb += texture(tMap, vUv).rgb;
  FragColor.a = 1.;
}
`