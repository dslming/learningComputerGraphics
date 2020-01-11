export let vertexShader =
  `
  uniform mat4 myProjectionMatrix;
  uniform mat4 myModelViewMatrix;
  void main() {
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_Position = myProjectionMatrix * myModelViewMatrix *vec4(position,1);
  }
`
