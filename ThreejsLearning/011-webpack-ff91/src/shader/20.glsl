
precision highp float;

float normFloat(float n, float minVal, float maxVal){
	return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

uniform vec3 cameraPosition;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 origin;

attribute vec2 uv;
attribute vec3 position;

varying vec2 vUv;
varying vec2 vOrigin;

void main() {
	vUv = uv;
	vOrigin = origin * 0.1;
 	vec4 realPos = modelMatrix * vec4(position, 1.0);

	gl_Position = projectionMatrix * viewMatrix * realPos;
}