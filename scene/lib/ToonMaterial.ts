// @ts-ignore
import { Program, Texture, Color } from 'ogl'
import RampMap from './RampMap'

type PaletteType = Array<{
    x: number,
    hex: string
}>

export default class ToonMaterial extends Program {
    uLightPosition: globalThis.Ref<number[]>
    ramp: RampMap
    constructor(gl: any, options: Partial<{ palette: PaletteType, lightPosition: [number, number, number] }> = {}) {
        const palette = options.palette || [{ x: 0, hex: '#000000' }]
        const uLightPosition = ref(options.lightPosition || [15, 15, 15])
        console.log(palette, uLightPosition.value);
        const ramp = new RampMap(palette)

        ramp.add({hex: '#00FF00', x: 0.5})
        const texture = {
            value: new Texture(gl, {
                image: ramp.gradientData,
                width: ramp.resolution,
                height: 1,
                flipY: false,
                generateMipmaps: false,
                minFilter: gl.NEAREST,
                magFilter: gl.NEAREST
            }),
        };
        texture.value.needsUpdate = true;

        super(gl, {
            fragment,
            vertex,
            uniforms: {
                tMap: texture,
                uLightPosition
            }
        })

        this.uLightPosition = uLightPosition
        this.ramp = ramp
    }
}
const vertex = /* glsl */`#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;

void main() {
    vNormal = normal;
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;



const fragment = /* glsl */ `#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vPosition;
in vec2 vUv;

uniform mat4 modelMatrix;
uniform sampler2D tMap;
uniform vec3 uLightPosition;

out vec4 FragColor;

void main() {
    vec3 normal = (normalize(vNormal) + 1.) /2.;

    vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0 )).xyz;
    vec3 worldNormal = normalize( vec3( modelMatrix * vec4( vNormal, 0.0 ) ) );
    vec3 lightVector = normalize( uLightPosition - worldPosition );
    float brightness = dot( worldNormal, lightVector );

    FragColor = texture(tMap, vec2(brightness, 0.5));
    FragColor.a = 1.;
}
`