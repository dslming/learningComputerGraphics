#define RED_COLOR vec3(1.0, 0.1, 0.1) // red
#define AMB_COLOR vec3(1.0, 0.6, 0.1)	// amber
#define WHT vec3(1.0, 1.0, 1.0)	// white

varying float redVal;
varying float ambVal;
varying float whtVal;
varying float brightness;

void main() {
	gl_FragColor = vec4((RED_COLOR * redVal + AMB_COLOR * ambVal) * brightness, 1.0);
}