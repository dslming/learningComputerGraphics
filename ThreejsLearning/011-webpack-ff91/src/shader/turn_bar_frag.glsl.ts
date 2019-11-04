export default
`
uniform sampler2D texture;
varying float brightness;
varying vec2 vUV;

// Normalizes a value between 0 - 1
float normFloat(float n, float minVal, float maxVal){
    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

void main() {
	// Additive
    gl_FragColor = texture2D( texture, vUV) * brightness;

	// Subtractive
	// gl_FragColor = texture2D( texture, gl_PointCoord ) - vec4( color, 1.0 );
	// gl_FragColor *= opacity;

	// Multip
	/* gl_FragColor = -texture2D( texture, gl_PointCoord ) * opacity;
	gl_FragColor *= 1.0 - vec4( color, 1.0 );
	gl_FragColor += 1.0; */
}
`