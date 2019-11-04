作者: DSLMing
时间: 2019.10.10

> 参考
> WebGL 编程指南.pdf 第5章

### 纹理映射

#### 1、纹理映射的步骤
纹理映射的过程需要顶点着色器和片元着色器二者的配合。

##### 1)指定纹理映射方式
为每个顶点指定纹理坐标:
```js
let verticesTexCoords = new Float32Array([
  //顶点坐标   纹理坐标
  -0.5,0.5,  0.0,1.0,
  -0.5,-0.5, 0.0,0.0,
   0.5,0.5,  1.0,1.0,
  0.5,-0.5,  1.0,0.0,
])
```

##### 2)加载纹理并配置
```js
function fLoadTexture(name, img) {
  // 创建一个纹理对象
  var tex = this.createTexture();
  // Set text buffer for work
  this.bindTexture(this.TEXTURE_2D, tex);
  // Push image to GPU.
  this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, img);
  // Setup up scaling
  this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
  this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR_MIPMAP_NEAREST);
  // Setup down scaling
  this.generateMipmap(this.TEXTURE_2D);
  // Precalc different sizes of texture for better quality rendering.
  this.bindTexture(this.TEXTURE_2D, null);									//Unbind
  return tex;
}

// 激活纹理单元
this.gl.activeTexture(this.gl.TEXTURE0);
// 绑定缓冲区
this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
// 传送给片元
this.gl.uniform1i(texture, 0);
```

这里着重说一下: `texParameteri`
```js
this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
```
第一个参数:纹理类型

第二个参数: 纹理操作
- **TEXTURE_MIN_FILTER**,纹理缩小时的滤波器
- **TEXTURE_MAG_FILTER**,纹理放大时的滤波器
- **TEXTURE_WRAP_S**,纹理水平填充方式,在s方向
- **TEXTURE_WRAP_T**,纹理垂直填充方式,在t方向

第三个参数: 纹理算法
**1)滤波器**
|常数名称|	意义	|
|-|-|
|NEAREST| 使用最接近目标像素中心的点的值
|LINEAR| 采用最接近目标像素的4点的加权平均值
|NEAREST_MIPMAP_NEAREST| 选择最佳的Mipmap并根据gl.NEAREST采用值
|NEAREST_MIPMAP_LINEAR|	选择最佳的Mipmap并根据gl.LINEAR采用值
|LINEAR_MIPMAP_NEAREST|	选择两个最佳的Mipmap，并根据gl.NEAREST获取每个值，最后采用这些值的加权平均值
|LINEAR_MIPMAP_LINEAR|	选择两个最佳的Mipmap,并根据gl.NEAREST获取每个值，最后采用这些值的加权平均值

**2) 填充方式**
常数名称	|意义|	例子
-|-|-
REPEAT|	遍历超出范围的值|	1.25=0.25, -0.25=0.75
MIRRORED_REPEAT|	遍历超出范围的值|	1.25=0.75, -0.25=0.25
CLAMP_TO_EDGE|	钳位值保持在0到1的范围内|	1.25=1.00, -0.25=0.00

<!-- 第三个参数: 纹理算法
1)
- **LINEAR**, 线性
- **NEAREST**, 使用最接近目标像素中心的点的值。
- **NEAREST_MIPMAP_NEAREST**,选择最佳的 Mipmap,并根据 gl.NEAREST 采用值。
- **NEAREST_MIPMAP_LINEAR**,选择最佳的 Mipmap,并根据 gl.LINEAR 采用值。
- **LINEAR_MIPMAP_LINEAR**,选择两个最佳的 Mipmap,并根据gl.NEAREST获取每个值，最后采用这些值的加权平均值。
2) 填充方式
- **REPEAT**,遍历超出范围的值,
- **CLAMP_TO_EDGE**,
- **MIRRORED_REPEAT**, -->

mesh信息:
```js
var aVert = [ -0.5,0.5,0, -0.5,-0.5,0, 0.5,-0.5,0, 0.5,0.5,0 ],
    aUV = [ 0,0, 0,1, 1,1, 1,0 ],
    aIndex = [ 0,1,2, 2,3,0 ];
```

顶点着色器代码:
```js
#version 300 es
in vec3 a_position;	//Standard position data.
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;

// 将UV值插值到片段着色器
out highp vec2 texCoord;

void main(void){
  // 该顶点对应的纹理坐标
  texCoord = a_uv;
  gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);
}
```

2) 在片元着色器中根据每个片元的纹理坐标从纹理图像中取出纹素颜色。


##### 3)在片元着色器中获取纹理像素颜色
```js
#version 300 es
precision mediump float;
in highp vec2 texCoord;		// What pixel to pull from the texture
uniform sampler2D uMainTex;	// Holds the texture we loaded to the GPU

out vec4 finalColor;
void main(void){
  // 根据该顶点的纹理坐标,去纹理中获取对应的颜色
  finalColor = texture(uMainTex, vec2(texCoord.s, texCoord.t));
}
```

#### 参考链接
[WebGL基础学习篇（Lesson 7）](https://github.com/fem-d/webGL/blob/master/blog/WebGL%E5%9F%BA%E7%A1%80%E5%AD%A6%E4%B9%A0%E7%AF%87%EF%BC%88Lesson%207%EF%BC%89.md)
[纹理参数](https://wgld.org/d/webgl/w028.html)

