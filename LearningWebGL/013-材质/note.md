作者: DSLMing
时间: 2019.10.31

> 参考:
> FunWithWebGL2 023 - Viva La Fungi

### 材质
材质这个概念是虚构出来的,WebGL 中并没有这个概念。这里提出来是为了将部分WebGL的参数抽象出来成为一个集合。
```js
class Material {
  constructor() {
    // 对光照的反应
    this.shader = null;
    this.uniforms = [];
    // 剔除
    this.useCulling = CULLING_STATE;
    // 融合
    this.useBlending = BLENDING_STATE;
    this.useModelMatrix = true;
    this.useNormalMatrix = false;
    this.drawMode = gl.TRIANGLES;
	}
}
```

**1)对光照的反应**
ambient(环境光)、diffuse(漫反射光)、specular(镜面高光), 该部分由shader代码负责。

**2)背面剔除**
一个封闭不透明的几何体一定是由很多三角形拼接而成, 背向我们的三角形，一般来说都是看不见的，为了提高运行效率可以不进行绘制，这就是背面剔除技术。
<img src="./01.png">

WebGL中,设定一个三角形三个点的连接顺序:
```js
// 逆时针顶点顺序为正面
gl.frontFace(gl.CCW);
// 顺时针顶点顺序为正面
gl.frontFace(gl.CW);
// 开启背面剔除
gl.enable(gl.CULL_FACE);
// 剔除背面
gl.cullFace(gl.BACK);
```

**3)融合**
把某一像素位置上原来的颜色和将要画上去的颜色，通过某种方式混在一起，从而实现特殊的效果。目标颜色可以表达为:
```js
// 源颜色: (Rs, Gs, Bs, As)
// 目标颜色: (Rd, Gd, Bd, Ad)
// 源因子: (Sr, Sg, Sb, Sa)
// 目标因子 :(Dr, Dg, Db, Da)
R = RsSr+RdDr
G = GsSg+GdDg
B = BsSb+BdDb
A = AsSa+AdDa
目标颜色=(R,G,B,A)
```

混合值:
名字|值
-|-
ZERO| 0, 0, 0, 0
ONE|	1, 1, 1, 1
SRC_COLOR|	sR, sG, sB, sA
DST_COLOR|	dR, dG, dB, dA
ONE_MINUS_SRC_COLOR|	1-sR, 1-sG, 1-sB, 1-sA
ONE_MINUS_DST_COLOR|	1-dR, 1-dG, 1-dB, 1-dA
SRC_ALPHA|	sA, sA, sA, sA
DST_ALPHA|	dA, dA, dA, dA
ONE_MINUS_SRC_ALPHA|	1-sA, 1-sA, 1-sA, 1-sA
ONE_MINUS_DST_ALPHA|	1-dA, 1-dA, 1-dA, 1-dA

```js
// 启用混合
glEnable(GL_BLEND);
// 关闭混合
glDisable(GL_BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
```

**4)深度检测**
深度检测不属于材质部分。但是和混合和背面剔除都是关于WebGL的设置,这里就顺带提一下。该功能启用了之后，OpenGL在绘制的时候就会检查，当前像素前面是否有别的像素，如果别的像素挡道了它，那它就不会绘制，也就是说，OpenGL就只绘制最前面的一层。
```js
// 深度检测开启
gl.enable(gl.DEPTH_TEST);
// 深度评价函数
gl.depthFunc(gl.LEQUAL)
```



#### 参考
[OPENGL——背面剔除](https://www.cnblogs.com/YTYMblog/p/5330538.html)
[WebGL学习笔记（四）：绘图](https://www.cnblogs.com/hammerc/p/11248617.html)
[glBlendFunc颜色混合](https://www.jianshu.com/p/b1544b0fc72c)

