#### 1、顶点着色器

**vUv**
纹理坐标
```js
// #include <common>
vec2 vUv;
vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
```

**diffuseColor**
漫反射的颜色
```js
// #include <color_fragment>
varying vec3 vColor;
diffuseColor.rgb *= vColor;
```
