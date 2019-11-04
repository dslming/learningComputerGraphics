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

varying float prog;
varying vec3 viewPos;
varying vec3 camPos;

void main() {
	vec4 realPos = modelMatrix * vec4(position, 1.0);
	
	viewPos = realPos.xyz;
	camPos = cameraPosition;
	prog = ((progress * 0.5) - 0.25);
	prog = normFloat(position.x, prog + 0.01, prog);

	gl_Position = projectionMatrix * viewMatrix * realPos;
}