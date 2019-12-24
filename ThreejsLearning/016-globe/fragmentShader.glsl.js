export let fragmentShader = `
uniform vec3 u_resolution;
uniform float u_time;
uniform sampler2D iChannel0;

mat3 xrot(float angle) {
  mat3 m;
  m[0] = vec3(1.0, 0.0, 0.0);
  m[1] = vec3(0.0, cos(angle), -sin(angle));
  m[2] = vec3(0.0, sin(angle), cos(angle));
  return m;
}

mat3 yrot(float angle) {
  mat3 m;
  m[0] = vec3(cos(angle), 0.0, -sin(angle));
  m[1] = vec3(0.0, 1.0, 0.0);
  m[2] = vec3(sin(angle), 0.0, cos(angle));
  return m;
}

float intersectSphere(vec3 camera, vec3 ray, vec3 sphereOrigin, float sphereRadius) {
  float radiusSquared = sphereRadius * sphereRadius;
  float dt = dot(ray, sphereOrigin - camera);
  if (dt < 0.0) {
      return -1.0;
  }
  vec3 tmp = camera - sphereOrigin;
  tmp.x = dot(tmp, tmp);
  tmp.x = tmp.x - dt * dt;
  if (tmp.x >= radiusSquared) {
      return -1.0;
  }
  float distanceFromCamera = dt - sqrt(radiusSquared - tmp.x);
  return distanceFromCamera;
}

vec4 render(vec2 uv, float time) {
  vec3 lightPosition = vec3(0.0, 0.0, -25.0);
  vec3 spherePosition = vec3(0.0, 0.0, 0.0);
  float sphereRadius = 1.4;
  vec3 cameraPosition = vec3(0.0, 0.0, -10.0);

  uv = uv * 2.0;
  uv.y -= 1.0;
  uv.x -= (1.0 / (u_resolution.y / u_resolution.x));

  vec3 pixelPosition = vec3(uv.x / 5.0, uv.y / 5.0, -9.0);

  vec3 ray = pixelPosition - cameraPosition;  // Generate a ray
  ray = normalize(ray);

  ray = ray * xrot(time * 0.3) * yrot(time * 0.3);
  cameraPosition = cameraPosition * xrot(time * 0.3) * yrot(time * 0.3);

  lightPosition = cameraPosition;

  float distance = intersectSphere(cameraPosition, ray, spherePosition, sphereRadius);

  if (distance > 0.0) {
    vec3 pointOfIntersection = cameraPosition + ray * distance;
    vec3 normal = normalize(pointOfIntersection - spherePosition);

    float u = 0.5 + atan(normal.z, normal.x) / (3.1415926 * 2.0);
    float v = 0.5 - asin(normal.y) / -3.1415926;

    float brightness = dot(normalize(lightPosition - spherePosition), normal);
    if (brightness < 0.0) {
        brightness = 0.0;
    }

    vec4 outputColor = texture2D(iChannel0, vec2(fract(u), fract(v)));

    float x = u * 18.0;
    float y = v * 10.0;
    if (fract(x) < 0.1 || fract(y) < 0.1) {
            outputColor *= 0.5;
    }
    return outputColor * brightness;
  }
  else {
    return vec4(0.0, 0.0, 0.0, 1.0);
  }
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = fragCoord.xy / u_resolution.xy;
  uv.x /= u_resolution.y / u_resolution.x;
  fragColor = render(uv, u_time);
}

void main() {
  // gl_FragCoord: 持有该framgent的屏幕相对坐标(x, y, z, 1/w)
  mainImage(gl_FragColor, gl_FragCoord.xy);
}

`
