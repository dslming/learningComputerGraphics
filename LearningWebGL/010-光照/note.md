作者: DSLMing
时间: 2019.10.20

> 参考:
> FunWithWebGL2 012-Phong Lighting


### 光照模型
**Phong模型:** 环境光 + 漫反射 + 镜面反射。
**Lambertian模型:** 漫反射。

#### 1、环境光
```js
void main()
{
  float ambientStrength = 0.1;
  vec3 ambient = ambientStrength * lightColor;
  vec3 result = ambient * objectColor;
  FragColor = vec4(result, 1.0);
}
```

#### 2、漫反射
漫反射是模拟光照到粗糙的物体表面的效果，会考虑到光的射入方向，但是不考虑观察者的视线方向，垂直射入的光线会比斜着射入的光线更加的明亮。
光线方向与模型表面的法线方向夹角越小应该看上去越亮。这一特性可以用点乘表示。
<img src="./01.png">

```js
计算公式: Diffuse = kDiffuse × N • L × CBase
```
- Diffuse表示漫反射颜色
- KDiffuse表示入射光颜色
- N表示物体表面法线方向
- L表示入射光方向
- CBase表示物体本身颜色


```js
varying vec4 fColor;
// 光的颜色
uniform vec4 diffuseProduct;
// 光的方向
uniform vec4 lightPosition;

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
```

#### 3、镜面反射
镜面反射是模拟光照到光滑的物体表面的效果，会产生明亮的斑点或强光，除了需要考虑到光的射入方向也要考虑观察者的视线方向。

```js
计算公式:
Specular = kSpecular × pow(max(R • V, 0), kSpecularPower)
```
- Specular表示镜面反射颜色
- kSpecular表示入射光颜色
- R = 2 × N × (N • L) – L
- N, L分别表示法线方向和入射光方向
- V表示观察方向
- kSpecularPower表示高光系数, 代表物体表面反射光的能力

#### 4、布光方式
1)三点布光
- 主体光,通常是区域光
- 辅助光,通常是区域光
- 轮廓光,通常是区域光

2) 物理天空+主光
天空盒+一个主光源。

#### Reference Links
* [Lighting in WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL)
* [Basic Lighting](https://learnopengl.com/#!Lighting/Basic-Lighting)
* [光照模型](http://eux.baidu.com/blog/fe/832)
