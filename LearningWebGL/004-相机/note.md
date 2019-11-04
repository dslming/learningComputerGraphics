### 相机的使用
#### 1、了解3个矩阵
```js
// 投影矩阵, 将看见的3d场景投影到2d平面
perspective: gl.getUniformLocation(program, "uPMatrix"),
// 模型矩阵, 被观察的3d物体
modalMatrix: gl.getUniformLocation(program, "uMVMatrix"),
// 相机矩阵, 相机所在的空间坐标
cameraMatrix: gl.getUniformLocation(program, "uCameraMatrix"),
```

#### 2、相机数据的准备
##### 1）准备投影矩阵(P)
```js
this.projectionMatrix = new Float32Array(16);
var ratio = gl.canvas.width / gl.canvas.height;
Matrix4.perspective(this.projectionMatrix, fov || 45, ratio, near || 0.1, far || 100.0);
```

##### 2) 准备相机矩阵(V)
```js
//Cache the matrix that will hold the inverse of the transform.
this.viewMatrix = new Float32Array(16);
```

##### 3) 准备模型矩阵
详细看上一讲。

#### 3、传入GPU
将矩阵通过uinfom传入着色器,然后开始使用。
```js
static getStandardUniformLocations(gl, program) {
  return {
    // 透视矩阵
    perspective: gl.getUniformLocation(program, "uPMatrix"),
    // 模型矩阵
    modalMatrix: gl.getUniformLocation(program, "uMVMatrix"),
    // 相机矩阵
    cameraMatrix: gl.getUniformLocation(program, "uCameraMatrix"),
    mainTexture: gl.getUniformLocation(program, "uMainTex")
  };
}
this.uniformLoc = getStandardUniformLocations()
setPerspective(matData) {
  this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData);
  return this;
}
setModalMatrix(matData) {
  this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData);
  return this;
}
setCameraMatrix(matData) {
  this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData);
  return this;
}
```

#### 4、着色器中使用
使用MVP矩阵。
```js
in vec3 a_position;
layout(location=4) in float a_color;
uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;
uniform vec3 uColor[4];
out lowp vec4 color;
void main(void){
  color = vec4(uColor[ int(a_color) ],1.0);
  gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);
};
```
<全文结束>
