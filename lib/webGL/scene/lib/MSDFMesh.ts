
import { Text, Transform, Color, Texture, Program, Mesh, Geometry } from 'ogl'
import { loadTexture } from '../utils/WebGL.utils'
import { basicVer } from '../shaders/BasicVer'

type MSDFMeshOption = {
  text: string,
  font: string,
  color: string,
  fontJsonUrl: string
}
export default class MSDFMesh {
  mesh: any
  scene: any

  constructor(gl: any, {
    text, font, color, fontJsonUrl
  }: MSDFMeshOption) {

    this.scene = new Transform()
    this.init(gl, { text, font, color, fontJsonUrl })
  }

  async init(gl: any, { text, font, color, fontJsonUrl }: MSDFMeshOption) {

    const { canvasSize, unWatch } = useCanvasSize()

    let texture = new Texture(gl)
    loadTexture(texture, font)

    const json = await (await fetch(fontJsonUrl)).json();

    const tMap = { value: texture }
    const program = new Program(gl, {
      vertex: basicVer,
      fragment,
      uniforms: {
        uAlpha: { value: 1 },
        uColor: { value: new Color(color) },
        tMap,
      }
    })

    const textGeometry = new Text({
      font: json,
      text,
      align: 'center',
      lineHeight: 1.4,
      size: 2
    });



    // Pass the generated buffers into a geometry
    const geometry = new Geometry(gl, {
      position: { size: 3, data: textGeometry.buffers.position },
      uv: { size: 2, data: textGeometry.buffers.uv },
      id: { size: 1, data: textGeometry.buffers.id },
      index: { data: textGeometry.buffers.index },
    });

    this.mesh = new Mesh(gl, {
      program,
      geometry
    })

    this.mesh.setParent(this.scene)
  }
}

const fragment = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D tMap;

uniform float uAlpha;
uniform vec3 uColor;
in vec2 vUv;
out vec4 color;

void main() {
    vec3 tex = texture(tMap, vUv).rgb;
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);

    if (alpha < 0.01) discard;

    color.rgb = uColor* uAlpha * alpha;
    // color.a = alpha;
    color.a = alpha * uAlpha;
}
`;
