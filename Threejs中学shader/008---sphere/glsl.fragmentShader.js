export let fragmentShader = `
varying vec2 vUv;
void main() {
  float lineNumber = 10.0;
  float lineWidth = 0.01;
  float x = fract(vUv.x * lineNumber);
  float y = fract(vUv.y * lineNumber);
  if(x<lineWidth || y <lineWidth) {
    gl_FragColor = vec4(vec3(0.0), 1.0);
  } else {
    gl_FragColor = vec4(1.);
  }
}
`
