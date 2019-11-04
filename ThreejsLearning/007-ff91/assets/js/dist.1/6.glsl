precision highp float;

float normFloat(float n, float minVal, float maxVal){
	return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

uniform vec3 cameraPosition;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float progress;

attribute vec3 position;
attribute vec3 normal;
attribute vec3 offset;
attribute float battID;

varying float brightness;

void main() {
	float prog = normFloat(progress, battID, battID + 5.0);
 	vec4 realPos = modelMatrix * vec4(offset + position * prog, 1.0);
	vec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));

	vec3 lightVector = normalize(cameraPosition - realPos.xyz);
	brightness = dot(realNorm, lightVector);
	// brightness = normFloat(brightness, 0.8, 0.3);	// Front side
	brightness = normFloat(-brightness, 0.8, 0.3);	// Back side
	gl_Position = projectionMatrix * viewMatrix * realPos;
}