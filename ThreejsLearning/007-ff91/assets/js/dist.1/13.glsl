varying float brightness;
varying vec2 vUV;

// Normalizes a value between 0 - 1
float normFloat(float n, float minVal, float maxVal){
    return max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));
}

void main() {
	vUV = uv;
    vec4 realPos = modelMatrix * vec4(position, 1.0);
    vec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));

    vec3 lightVector = normalize(cameraPosition - realPos.xyz);
    float diffuse = dot(realNorm, lightVector);
    brightness = normFloat(diffuse, 0.0, 0.5);

    vec4 mvPosition = viewMatrix * realPos;
    gl_Position = projectionMatrix * mvPosition;
}