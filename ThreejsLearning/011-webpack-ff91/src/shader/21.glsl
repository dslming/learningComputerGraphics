precision mediump float;

uniform vec3 color;
uniform sampler2D texture;

varying float opacity;
varying float diagonal;

void main() {
		vec2 coords = vec2(abs(step(0.5, diagonal) - gl_PointCoord.x), gl_PointCoord.y);
		gl_FragColor = vec4(color, opacity) * texture2D(texture, coords);
}