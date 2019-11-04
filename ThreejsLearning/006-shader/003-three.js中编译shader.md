### 将原生的webgl编译过程在three.js中找到对应的位置.

#### 1、WebGLShader.js
> 文件位置: src/renderers/webgl/
- [x] createShader()
- [x] shaderSource()
- [x] compileShader()

#### 2、WebGLProgram.js
> 文件位置: src/renderers/webgl/
- [x] getShaderParameter()
- [x] getShaderInfoLog()
- [x] deleteShader()
- [x] createProgram()
- [x] attachShader()
- [x] linkProgram()
- [x] getProgramParameter()
- [x] getProgramInfoLog()
- [x] deleteProgram()

#### 3、WebGLState.js
> 文件位置: src/renderers/webgl/
- [x] useProgram()
- [x] clearColor()

#### 4、WebGLBufferRenderer.js
> 文件位置: src/renderers/webgl/
- [x] drawArrays()

#### 5、WebGLRenderer.js
> 文件位置: src/renderers/
- [x] drawArrays()

#### 6、WebGLProgram.js
> 文件位置: src/renderers/webgl/

内置unifrom
```js
'uniform mat4 modelMatrix;',
'uniform mat4 modelViewMatrix;',
'uniform mat4 projectionMatrix;',
'uniform mat4 viewMatrix;',
'uniform mat3 normalMatrix;',
'uniform vec3 cameraPosition;',

'attribute vec3 position;',
'attribute vec3 normal;',
'attribute vec2 uv;',
```

#### 7、WebGLLight.js
> 文件位置: src/renderers/webgl/
根据光源类型，为unifrom中的变量赋值。

```js
case 'SpotLight':
    uniforms = {
        position: new Vector3(),
        direction: new Vector3(),
        color: new Color(),
        distance: 0,
        coneCos: 0,
        penumbraCos: 0,
        decay: 0,

        shadow: false,
        shadowBias: 0,
        shadowRadius: 1,
        shadowMapSize: new Vector2()
    };
```

#### 8、UniformsLib.js
> 文件位置: src/renderers/shaders/

```js
	common: {

		diffuse: { value: new Color( 0xeeeeee ) },
		opacity: { value: 1.0 },

		map: { value: null },
		uvTransform: { value: new Matrix3() },

		alphaMap: { value: null },

	},
```
