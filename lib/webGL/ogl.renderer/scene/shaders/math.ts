export const csin = `float csin(float x) {
    return sin(x) * 0.5 + 0.5;
}`

export const shaderEase = {
    i1: `float i1(float x) {
    return 1. - cos(x * (.5 * 3.1415));
}`,
    o1: `float i1(float x) {
    return sin(x * (.5 * 3.1415));
}`,
    io2: `float io2(float x) {
    return x < .5 ? 2. * x * x : (4. - 2. * x) * x - 1.;
}`,
    i5: `float i5(float x) {
    return x * x * x * x * x;
}`,
    o5: `float o5(float x) {
    return 1. - x * x * x * x * x;
}`,
}