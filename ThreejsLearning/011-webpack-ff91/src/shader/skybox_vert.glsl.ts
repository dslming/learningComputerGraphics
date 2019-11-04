export default `
varying vec3 vWorldPosition;

vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}

void main() {
	vWorldPosition = transformDirection( position, modelMatrix );
	vec3 transformed = vec3( position );
	vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
	gl_Position.z = gl_Position.w; // set z to camera.far
}
`