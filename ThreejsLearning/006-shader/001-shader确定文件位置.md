### three.js 中 shader 的使用

#### 1、OpenGL中六种常见坐标系
* Object or model coordinates(模型坐标系)
* World coordinates(世界坐标系)
* Eye/Camera coordinates(视坐标系)
* Clip coordinates(裁剪坐标系)
* Normalized device coordinates(归一化设备坐标系)
* Window/screen coordinates(屏幕坐标系)

#### 2、自定义shader
https://threejs.org/docs/#api/zh/materials/ShaderMaterial

#### 3、系统shader
以光照模型 lambert 为例探寻系统shader如何发挥作用。

##### 1) ShaderLib.js 中引用
> 文件位置: src/renderers/shaders/
```js
lambert: {
    uniforms: mergeUniforms( [
        UniformsLib.common,
        UniformsLib.specularmap,
        UniformsLib.envmap,
        UniformsLib.aomap,
        UniformsLib.lightmap,
        UniformsLib.emissivemap,
        UniformsLib.fog,
        UniformsLib.lights,
        {
            emissive: { value: new Color( 0x000000 ) }
        }
    ] ),
    vertexShader: ShaderChunk.meshlambert_vert,
    fragmentShader: ShaderChunk.meshlambert_frag
}
```

##### 2) ShaderChunk.js 中引用
>文件位置: src/renderers/shaders/
```js
// 顶点着色器
import meshlambert_vert from './ShaderLib/meshlambert_vert.glsl.js';
// 片元着色器
import meshlambert_frag from './ShaderLib/meshlambert_frag.glsl.js';
```

#### 3) lights_lambert_vertex.glsl.js
>文件位置: src/renderers/shaders/shaderChunk

### babylon.js 中 shader
> 在线编辑器: https://cyos.babylonjs.com/
