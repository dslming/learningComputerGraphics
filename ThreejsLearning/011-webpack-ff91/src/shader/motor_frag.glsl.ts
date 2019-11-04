export default `
#extension GL_OES_standard_derivatives : enable
precision highp float;

varying float prog;
varying vec3 viewPos;
varying vec3 camPos;

float normFloat(float n, float minVal, float maxVal){
	return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

void main() {
	vec3 xTangent = dFdx( viewPos );
	vec3 yTangent = dFdy( viewPos );
	vec3 faceNormal = normalize( cross( xTangent, yTangent ) );
	vec3 lightVector = normalize(camPos - faceNormal);

	float alpha = dot(faceNormal, lightVector);
	alpha = normFloat(alpha, 0.5, 1.0) * prog;
	// alpha = normFloat(alpha, 1.0, 0.5) * prog;

	gl_FragColor = vec4(0.627, 0.443, 0.341, alpha);
}
`