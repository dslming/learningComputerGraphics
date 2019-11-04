#define PI 3.1415926

uniform float vpH;
uniform float size;
uniform float brightness;
varying float opacity;

// Normalizes a value between 0 - 1
float normFloat(float n, float minVal, float maxVal){
    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

void main() {
    vec4 realPos = modelMatrix * vec4(position, 1.0);
    vec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));

    vec3 lightVector = normalize(cameraPosition - realPos.xyz);
    opacity = dot(realNorm, lightVector);
    opacity = normFloat(opacity, 0.5, 1.0) * brightness;

    vec4 mvPosition = viewMatrix * realPos;
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = max((vpH * size / -mvPosition.z) * opacity, 0.0);
}