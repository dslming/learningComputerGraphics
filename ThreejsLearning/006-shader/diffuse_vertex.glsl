// three.js 的 WebGLShader函数中,打印编译之后的代码:
precision highp float;
precision highp int;
#define SHADER_NAME ShaderMaterial
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;


varying vec4 fColor;
// 光的颜色
uniform vec4 diffuseProduct;
// 光的方向
uniform vec4 lightPosition;
// uniform mat3 normalMatrix;

void main()
{
    vec3 pos = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vec3 light = lightPosition.xyz;
    vec3 L = normalize(lightPosition.xyz);
    vec3 N = normalize( normalMatrix* normal.xyz);
    float Kd = max( dot(L, N), 0.0 );

    vec4 diffuse = Kd*diffuseProduct;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    fColor = diffuse;
}