export default `
#define RED vec3(1.0, 0.1, 0.1) // red
#define AMB vec3(1.0, 0.6, 0.1)	// amber
#define WHT vec3(1.0, 1.0, 1.0)	// white

varying float wht;
varying float amb;
void main() {
	gl_FragColor = vec4((WHT*wht + AMB * amb), 1.0);
	// gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`