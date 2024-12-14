const msdfFrag = /* glsl */ `#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
    vec3 tex = texture2D(tMap, vUv).rgb;
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);


    gl_FragColor.rgb = vec3(0.616,0.388,0.506) * alpha;
    gl_FragColor.a = 1.;
}`

export { msdfFrag }
