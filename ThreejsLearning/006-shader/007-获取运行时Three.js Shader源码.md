翻译自: [如何在运行时获取Three.js Shader源代码](https://blog.andrewray.me/how-to-get-three-js-shader-source-code-at-runtime/)


### 获取运行时Three.js Shader源码

#### 1、方法一-原生提供的方法打印
Three.js使用棘手的字符串连接系统根据场景中的数据（例如当前的灯光数量）构建其着色器。

在后台，至少从r100开始，Three.js 使用一个称为的函数构建着色器initMaterial，该函数仅在渲染时发生（如果材质是新的或needsUpdate已设置）。

要使Three.js运行着色器代码而不必执行渲染，可以在Three.js中使用称为的实用程序方法强制着色器“编译” #compile：

.compile ( scene : Scene, camera : Camera ) : null

使用相机编译场景中的所有材质。这对于在第一次渲染之前预编译着色器很有用。

然后，您可以使用Three.js创建的GL上下文获取正在运行的着色器代码。这是通用代码：

```js
const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

// ... your scene setup code ...
// ... you MUST add the material to an object in the scene! ...

// Force shaders to be built
renderer.compile(scene, camera);

// Get the GL context:
const gl = renderer.getContext();

// Print the shader source!
console.log(
  gl.getShaderSource(material.program.fragmentShader)
);
```


#### 2、方法二-利用浏览器插件
[github地址](https://github.com/spite/ShaderEditorExtension)
[谷歌商店地址](https://chrome.google.com/webstore/detail/shader-editor/ggeaidddejpbakgafapihjbgdlbbbpob)

利用shader-editor插件:
```js
class ThreeLiveRawShaderEditor {

  constructor(renderer, camera, scene) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
  }

  compile() {
    this.renderer.compile(this.scene, this.camera);
  }
}
var TLRSE= new ThreeLiveRawShaderEditor(renderer, camera, scene);
```
<全文结束>
