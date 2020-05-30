> https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8

#### 输入和输出
VertexShader
- 没有输入
- 在2D平面上输出gl_Position（vec4）顶点坐标
- 输出gl_PointSize（float）点的大小

FragmentShader
- 输入gl_FrontFacing（bool）多边形的前后布尔值
- 输入gl_FragCoord（vec4）窗口坐标=画布上的坐标（x，y，z，1 / w）
- 输入gl_PointCoord（vec2）点精灵的2D坐标
- 输出gl_FragColor（vec4）像素绘制颜色
- 出力 gl_FragData 与glDrawBuffers一起使用的数组数据

#### 在GLSL ES上处理的类型
- int (整数)
- ivec2，ivec3，ivec4（int的向量）
- 布尔（布尔）
- bvec2，bvec3，bvec4（bool的载体）
- 浮动
- vec2，vec3，vec4（浮子矢量）
- mat2,mat3,mat4 (行列)
- sampler2D（2D纹理）
- samplerCube（3D纹理）

#### 变量已由threejs定义
| 变量名称 | 说明 |
| -------- | ---- |
| modelMatrix      | 从对象坐标转换为世界坐标                                                     |
| viewMatrix       | 从世界坐标转换为视点坐标                                                     |
| modelViewMatrix  | 整合modelMatrix和viewMatrix                                                  |
| projectionMatrix | 一个矩阵，它根据各种摄像机参数将三维投影到两个维度，并将它们转换为剪辑坐标系 |
| cameraPosition   | 相机位置                                                                     |
| normalMatrix     | 矩阵将顶点法线向量转换为视点坐标系                                           |
| position         | 顶点坐标                                                                     |
| nomail           | 顶点法向量                                                                   |
| vUv           | 用于粘贴纹理的UV坐标                                                         |

顶点着色器可以使用所有内容。
对于片段着色器，只能使用viewMatrix和cameraPosition。
在片段着色器侧使用时，它会一次插入顶点着色器中的变量变量中。vUv = vu;

#### 从threejs传递uniform / attribute时指定的字符串（类型）
- i (整数)
- f（浮动）
- v2（THREE.Vector2）
- v3（THREE.Vector3）
- v4（THREE.Vector4）
- c（THREE.Color）
- m4（THREE.Matrix4）
- t（THREE.Texture）

```js
// uniform_type.js
var uniformsExample = {
    "uInt" :  { type: "i", value: 1 },     // single integer
    "uFloat" : { type: "f", value: 3.14 }, // single float
    "uVec2" : { type: "v2", value: new THREE.Vector2( 0, 1 ) },       // single Vector2
    "uVec3" : { type: "v3", value: new THREE.Vector3( 0, 1, 2 ) },    // single Vector3
    "uVec4" : { type: "v4", value: new THREE.Vector4( 0, 1, 2, 3 ) }, // single Vector4
    "uCol" : { type: "c", value: new THREE.Color( 0xffaa00 ) }, // single Color
    "uMat4" : { type: "m4", value: new THREE.Matrix4() }, // single Matrix4
    "uTex" :     { type: "t", value: THREE.ImageUtils.loadTexture( "texture.jpg" ) }, // regular texture
    "uTexCube" : { type: "t", value: THREE.ImageUtils.loadTextureCube( [ "px.jpg", "nx.jpg", // cube texture
    "uIntArray"  : { type: "iv1", value: [ 1, 2, 3, 4, 5 ] },    // integer array (plain)
    "uIntArray3" : { type: "iv", value: [ 1, 2, 3, 4, 5, 6 ] },   // integer array (ivec3)
    "uFloatArray"  : { type: "fv1", value: [ 0.1, 0.2, 0.3, 0.4, 0.5 ] },    // float array (plain)
    "uFloatArray3" : { type: "fv",  value: [ 0.1, 0.2, 0.3, 0.4, 0.5, 0.6 ] }, // float array (vec3)
    "uVec2Array" : { type: "v2v", value: [ new THREE.Vector2( 0.1, 0.2 ),
    "uVec3Array" : { type: "v3v", value: [ new THREE.Vector3( 0.1, 0.2, 0.3 ),
    "uVec4Array" : { type: "v4v", value: [ new THREE.Vector4( 0.1, 0.2, 0.3, 0.4 ),
    "uMat4Array" : { type: "m4v", value: [ new THREE.Matrix4(), new THREE.Matrix4() ] }, // Matrix4 array
    "uTexArray" : { type: "tv", value: [ new THREE.Texture(), new THREE.Texture() ] } // texture array (regular)
};
```

#### 着色器存储在threejs中的位置
https://github.com/mrdoob/three.js/tree/master/src/renderers/shaders
* THREE.ShaderChunk =常用的GLSL代码片段
*用于操作THREE.UniformsUtils =制服定义的实用函数
* THREE.UniformsLib =常用的制服定义
* THREE.ShaderLib =用于每种材质的着色器定义

#### GLSL ES内置功能
| 功能名称                       | 说明                                                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| sign(x)                        | 符号判别, 负:-1, :0,正:1                                                                                  |
| fract(x)                       | 仅返回小数部分                                                                                            |
| mod(x,y)                       | 求模计算%                                                                                                 |
| clamp(x,y,a)                   | 夹紧过程min（max（x，y），a）                                                                             |
| mix(x,y,a)                     | x, y的线性混叠， x(1-a) + y*a;                                                                            |
| smoothstep(edge0,edge1,x)      | 在x的元素中，边缘0以下的元素为0.0，边缘1以上的元素为1.0。当x在edge0和edge1之间时，它返回立方Hermite插值。 |
| step(a,x)                      | 当x <a 0,1时x a a                                                                                         |
| sqrt(x),inverssqrt(x)          | invers是1 / sqrt（x）                                                                                     |
| normalize(x)                   | 正规化                                                                                                    |
| faceforward(N,I,Nref)          | 根据条件反转法向量N.                                                                                      |
| reflect(I,N)                   | 返回入射矢量I的反射矢量相对于法线矢量N的平面                                                              |
| refract(I,N,eta)               | 对于折射率为eta的法向量N的平面，                                                                          |
| length(x)                      | 矢量长度=绝对值                                                                                           |
| distance(x,y)                  | x和y之间的距离                                                                                            |
| dot(x,y)                       | 内积                                                                                                      |
| cross(x,y)                     | 外积                                                                                                      |
| texture2D(uTexture, texCoords) | 返回uTexture的texCoords坐标的颜色（vec4）                                                                 |

> 参考: http://ec.nikkeibp.co.jp/nsp/dl/08513/HTML5GAMES_AppC.pdf



#### Obejct3D.matrix、.matrixWorld、.modelViewMatrix、.normalMatrix
> 参考: https://blog.csdn.net/weixin_37683659/article/details/88783655

1).matrix : Matrix4
局部变换矩阵，其实也就是模型矩阵

2)matrixWorld : Matrix4
- 物体的世界变换矩阵，若这个Object3D没有父级，则它将和模型矩阵相同，
- 其实就是此时他是个4X4的单位矩阵乘上物体的模型矩阵
- 其中父与子的关系，可以说层级模型的概念，也常常应用到旋转的操作

3).modelViewMatrix : Matrix4
- 这个值传递给着色器，用于计算物体的位置。
- 也就是视图矩阵，用于计算物体在相机空间的位置

4).normalMatrix : Matrix3
这个值传递给着色器，用于计算物体的光照。 它是物体的modelViewMatrix矩阵中，
左上角3x3子矩阵的逆的转置矩阵。(直接变变换到相机空间)

简单总结下来，以下4点：
    1.matrix：模型矩阵
    2.matrixWorld 世界矩阵
    3.modelViewMatrix 视图矩阵  （这三个矩的阵概念可以看我渲染流程的博客）
    4.normalMatrix  模型矩阵的逆转置矩阵  （这里留个问题吧，为什么要用逆转置矩阵呢，可以思考一下）

其他:
- Object3D.matrix是相对于Object3D.parent来说，要在世界空间中获取其所在的变换矩阵，必须访问Object3D.matrixworld，
那我们来思考一下 Object3D.matrixworld是如何计算的呢，在前面我提到过物体的世界变换矩阵，若这个Object3D没有父级，则它将和模型矩阵相同，其实就是此时他是个4X4的单位矩阵乘上物体的模型矩阵。
- 简单来说，THREE中的物体是有层级关系的，所以THREE中物体的 matrixworld是通过模型矩阵 （Object3D.matrix）与父亲的 Object3D.matrixworld递归相乘得到的，哈哈。


#### glsl 内置变量
gl_FragColor 片元的颜色
gl_FragCoord 该片元的像素坐标，范围是viewport的宽高。
