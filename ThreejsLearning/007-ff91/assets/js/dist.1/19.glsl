precision highp float;

#define COUNT 20.0
#define MAX_SCALE 3.0

uniform sampler2D led;

varying vec2 vUv;
varying vec2 vOrigin;

float normFloat(float n, float minVal, float maxVal){
	return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

void main() {
	// Brightness fades away from center
	float brightness = distance(vUv, vec2(0.5));
	brightness = normFloat(brightness, 0.5, 0.0);

	// Scale is a function of brightness [0 - 3.0]
	float scale = (brightness * brightness) * MAX_SCALE;
	float invScale = (1.0 / scale);
	float halfInvScale = (invScale - 1.0) / 2.0;

	// Multiply for count, abs(-0.5) for zig-zag
	vec2 newUV = abs(fract((vUv + vOrigin) * COUNT) - 0.5) * 2.0;

	// Scale up and clamp edges for padding
	newUV = clamp((newUV * invScale) - halfInvScale, 0.0, 1.0);

	float texColor = texture2D(led, newUV).a * 0.15 * brightness;
	gl_FragColor = 1.0 - vec4(texColor, texColor, texColor, 0.0);
}