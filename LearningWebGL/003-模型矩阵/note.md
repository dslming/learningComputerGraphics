#### 1、模型矩阵的概念
模型矩阵,包括了以模型自己为坐标参考系的`旋转`、`缩放`、`平移`一系列变换的统一矩阵，
称为模型矩阵。

#### 2、如何获得
1)变换的种类
```js
this.position	= new Vector3(0,0,0);	//Traditional X,Y,Z 3d position
this.scale		= new Vector3(1,1,1);	//How much to scale a mesh. Having a 1 means no scaling is done.
this.rotation	= new Vector3(0,0,0);	//Hold rotation values based on degrees, Object will translate it to radians
this.matView 	= new Matrix4();		//Cache the results when calling updateMatrix
```

2)生成模型矩阵`matView`
```js
updateMatrix(){
  this.matView.reset() //Order is very important!!
    .vtranslate(this.position)
    .rotateX(this.rotation.x * Transform.deg2Rad)
    .rotateZ(this.rotation.z * Transform.deg2Rad)
    .rotateY(this.rotation.y * Transform.deg2Rad)
    .vscale(this.scale);

  //Calcuate the Normal Matrix which doesn't need translate, then transpose and inverses the mat4 to mat3
  Matrix4.normalMat3(this.matNormal,this.matView.raw);

  //Determine Direction after all the transformations.
  Matrix4.transformVec4(this.forward,	[0,0,1,0],this.matView.raw); //Z
  Matrix4.transformVec4(this.up,		[0,1,0,0],this.matView.raw); //Y
  Matrix4.transformVec4(this.right,	[1,0,0,0],this.matView.raw); //X

  return this.matView.raw;
}
```

#### 3、传送矩阵给GPU
将模型矩阵通过uniform 传送给顶点着色器。
```js
let modalMatrix =	gl.getUniformLocation(program,"uMVMatrix"),
setModalMatrix(matData) {
  this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData);
  return this;
}
```

#### 4、着色器使用矩阵
```js
//Standard position data.
in vec3 a_position;
//Will hold the 4th custom position of the custom position buffer.
layout(location=4) in float a_color;

uniform mat4 uMVMatrix;
uniform vec3 uColor[4];	//Color Array

out lowp vec4 color;	//Color to send to fragment shader.

void main(void){
  //Using the 4th float as a color index.
  color = vec4(uColor[ int(a_color) ],1.0);
  gl_Position = uMVMatrix * vec4(a_position, 1.0);
}
```
