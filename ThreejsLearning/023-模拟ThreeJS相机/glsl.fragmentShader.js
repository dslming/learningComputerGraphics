export let fragmentShader = `
uniform vec3 color;
void main() {
 // 给此片元的颜色值
 gl_FragColor = vec4(color,1.0);
}
`
