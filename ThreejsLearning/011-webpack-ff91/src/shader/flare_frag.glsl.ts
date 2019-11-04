export default
`
uniform vec3 color;
uniform sampler2D texture;

varying float opacity;

// Normalizes a value between 0 - 1
float normFloat(float n, float minVal, float maxVal){
    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

void main() {
	// Additive
    gl_FragColor = texture2D( texture, gl_PointCoord);
    gl_FragColor.a = normFloat(opacity, 0.01, 0.1);
}
`