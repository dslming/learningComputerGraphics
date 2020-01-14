> 参考:
> https://www.cnblogs.com/softimagewht/p/4750847.html

## ThreeJS 给 Shader传参
### 一、Shader三种变量类型（uniform, attribute 和varying）

#### 1、uniform
- **顶点着色器**和**片元着色器**都可以使用
- 一般用来传递：变换矩阵，材质，光照参数和颜色等信息
- 用法: 外部(js)给着色器传数据
```js
// 着色器代码
uniform vec4 u_FragColor;
void main(){
  gl_FragColor=u_FragColor;
}
// js代码
var u_FragColor=gl.getUniformLocation(gl.program,'u_FragColor');
gl.uniform4f(u_FragColor,0.0,1.0,1.0,1.0);
```

#### 2、attribute
- 只能在**顶点着色器**中使用
- 一般用来传递顶点的数据,如:顶点坐标，法线，纹理坐标，顶点颜色
- 用法: 外部(js)给着色器传数据
- 类型: float，vec2，vec3，vec4，mat2，mat3，mat4
```js
// 着色器代码
attribute vec4 a_Position;
void main() {
  gl_position = a_Position;
  gl_Pointsize = 10.0;
};

// js代码
var a_position = gl.getAttribLocation(gl.program,'a_Position');
gl.vertexAttrib3f(a_position,0.0,0.0,0.0);
```

#### 3、varying
- 一般vertex shader修改varying变量的值，然后fragment shader使用该varying变量的值
- varying变量在vertex和fragment shader二者之间的声明必须是一致的
- 用法: **顶点着色器**给**片元着色器**传递数据


### 二、ThreeJS 给 Shader传递数据
#### 1、uniform
```js
// js 代码
let uniforms = {
  color: {
    type: "c",
    value: new THREE.Color(0xff0000)
  }
}
let material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});

// 着色器代码
export let fragmentShader = `
uniform vec3 color;
void main() {
 // 给此片元的颜色值
 gl_FragColor = vec4(color,1.0);
}
`
export let vertexShader = `
  void main() {
      gl_Position = myProjectionMatrix * myModelViewMatrix *vec4(position,1);
  }
`
```

#### 2、attribute
通过 attribute给shader传递参数
```js
// js代码
let vertices = [...]
var geometry = new THREE.BufferGeometry();
geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ));

// 顶点着色器
attribute vec3 position;
...
```
<全文结束>
