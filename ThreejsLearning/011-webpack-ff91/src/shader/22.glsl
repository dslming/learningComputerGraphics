precision mediump float;

#define PI 3.14159265
#define WAVE_LENGTH 0.125
#define SIZE_MAX 0.45
#define TIME_FACTOR 0.4

uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float vpH;
uniform float time;
uniform vec2 mousePos;
uniform float playhead;

varying float opacity;
varying float diagonal;

attribute vec3 position;

float normFloat(float n, float minVal, float maxVal){
	return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

void main() {
	float currentTime = time * TIME_FACTOR;

	// Alternate diagonal direction
	diagonal = mod(position.x + position.y, 2.0);

	// Add sine waves from origin
	float distOrigin = distance(position.xy, vec2(-0.5, 0.0));   // FF Logo
	float sizeOrigin = normFloat(distOrigin, 40.0, 0.0);
	sizeOrigin = (sizeOrigin + currentTime) / WAVE_LENGTH;
	sizeOrigin = (sin(sizeOrigin) + 1.0) * SIZE_MAX;

	// Add cos waves from mousePos
	float distMouse = distance(position.xy, mousePos);
	float sizeMouse = distMouse / -40.0;
	sizeMouse = (sizeMouse + currentTime * 0.67) / WAVE_LENGTH * 0.67;
	sizeMouse = (cos(sizeMouse) + 1.0) * SIZE_MAX;

	// Determine progress based on playhead and distance
	float progress = normFloat(distOrigin, -30.0, 40.0);
	progress = smoothstep(progress - 0.5, progress, playhead);

	// Combine both values
	float size = sizeMouse * sizeOrigin * progress;

	// Add wave when growing
	size += (sin((progress * PI * 2.0) - (PI / 2.0)) + 1.0) / PI;

	// Make logo
	if(distOrigin + (1.0 - progress) * 5.0 < 1.7){
		size = progress;
	}

	// Fade outside of radius
	size *= normFloat(distOrigin, 40.0, 35.0);
	opacity = size * 1.0;

	vec4 mvPosition = modelViewMatrix * vec4(position.x, position.y, size * 4.0 - (1.0 - progress) * 50.0, 1.0 );
	gl_PointSize = 0.125 * vpH * size / -mvPosition.z;
	gl_Position = projectionMatrix * mvPosition;
}