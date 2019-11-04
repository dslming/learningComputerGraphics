precision highp float;
varying float brightness;

void main() {
	// gl_FragColor = vec4(0.627, 0.443, 0.341, brightness); // Copper
	gl_FragColor = vec4(0.29, 0.82, 0.95, brightness);	// Blue
}