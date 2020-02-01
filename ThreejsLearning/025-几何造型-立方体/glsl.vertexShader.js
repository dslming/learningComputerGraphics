export let vertexShader = `
  attribute vec3 myPosition;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(myPosition, 1.0);
  }
`
