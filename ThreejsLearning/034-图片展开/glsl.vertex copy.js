export let vertex = `
const float PI = 3.1415925;

uniform float angle;
uniform float progress;
uniform vec4 resolution;
varying vec2 vUv;

// 通过缩小rbg的值,降低亮度
varying float vFrontShadow;
uniform sampler2D texture1;
uniform vec2 pixels;

// three.js/math/Matrix4.js/makeRotationAxis()
mat4 makeRotationAxis(vec3 axis, float angle){
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float t = 1. - c;
  float x = axis.x;
  float y = axis.y;
  float z = axis.z;
  float tx = t * x;
  float ty = t * y;

  return mat4(
    tx * x + c, tx * y - s * z, tx * z + s * y, 0,
    tx * y + s * z, ty * y + c, ty * z - s * x, 0,
    tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
    0., 0., 0., 1.
  );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = makeRotationAxis(axis, angle);
  return (m * vec4(v, 1.)).xyz;
}

void main() {
  vUv = uv;
  float finalAngle = angle;
  vec3 newposition = position;
  float rad = .1;
  float rolls = 8.;

  // rot
  newposition = rotate(
    newposition + vec3(.5, -.5, 0.),
    vec3(0., 0., 1.),
    -finalAngle
  );
  newposition -= vec3(.5, -.5, 0.);

  // -0.5..0.5 -> 0..1
  float offs = (newposition.x + .5) / (sin(finalAngle) + cos(finalAngle));
  float tProgress = clamp((progress - offs * .99) / .01, 0., 1.);

  // shadows
  vFrontShadow = clamp((progress - offs * .95) / .05, .5, 1.);

  newposition.z = rad + rad * (1. - offs / 2.) * sin(-offs * rolls * PI- .5 * PI);
  newposition.x = -.5 + rad * (1. - offs / 2.) * cos(-offs * rolls * PI + .5 * PI);

  // rot back
  newposition = rotate(
    newposition - vec3(-.5, .5, 0.),
    vec3(0., 0., 1.),
    finalAngle
  );
  newposition += vec3(-.5,.5,0.);

  // unroll
  newposition = rotate(
    newposition - vec3(-.5, .5, rad),
    vec3(sin(finalAngle), cos(finalAngle), 0.),
    -PI * progress * rolls
  );

  newposition += vec3(
    -.5 + progress * cos(finalAngle) * (sin(finalAngle) + cos(finalAngle)),
    .5 - progress * sin(finalAngle) * (sin(finalAngle) + cos(finalAngle)),
    rad * (1. - progress / 2.)
  );

  // animation
  vec3 finalposition = mix(newposition, position, tProgress);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalposition, 1.);
}
`;
