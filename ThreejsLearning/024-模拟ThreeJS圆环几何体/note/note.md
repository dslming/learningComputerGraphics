[代码出处](https://github.com/mrdoob/three.js/blob/master/src/geometries/CircleGeometry.js)

> 参考:
> https://www.jianshu.com/p/5f6d0cd75443

### 024-模拟ThreeJS扇形几何体
<img src="02.webp">

#### 1、网格(Mesh)
在ThreeJS中3D物体的网格(Mesh)由几何体(Geometry)和材质(Material)组成。

```js
const geometry = new THREE.PlaneGeometry(1,1);
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
```

#### 2、几何体(Geometry)
几何体由三角形组成，三角形由点组成。，组成三角形的点叫做顶点(vertex)，法向量(normal)决定了每个顶点在光照下所呈现出的颜色。

Geometry 的要素:
**(1) 顶点(Vertex)**
ThreeJS中的属性 `geometry.vertices`查看顶点数据。
<img src="04.png">

**(2) 面(Face)**
ThreeJS中的属性 `geometry.faces`通过数组的形式保存了一个3D物体所有的三角面信息。
<img src="03.png">

数组每一项的内容:
- a,b,c: `geometry.vertices`的顶点索引
- normal: THREE.Vector3 : 三角面的法向量
- vertexNormals: Array: 每个顶点的法向量
- color: THREE.Color: 指定面的颜色
- vertexColors:Array 指定每个顶点的颜色
  **注意**
  一个三角面只会有一个法向量。一个顶点会属于不同的三角面，因此一个顶点会有多个法向量。
  <img src="05.webp">

#### 3、计算圆形的顶点
<img src="06.webp">

```js
// 顶点的数量
vertices.length = 1(圆心) + (segments + 1);
// 每个顶点的X,Y值
//Θ等于每个三角形的所经过的圆心角度数
Θ = thetaStart + (thetaLength / segments) * index
X = radius * cos(Θ)
Y = radius * sin(Θ)
```

顶点位置:
```js
for(s =0; s<= segments;s++) {
  var segment = thetaStart + s / segments * thetaLength;
  vertex.x = radius * Math.cos( segment );
  vertex.y = radius * Math.sin( segment );
  vertex.z = 0;
  vertices.push(vertex.x,vertex.y,vertex.z = 0)
}
```

顶点索引:
```js
//保存顶点索引
//(1,2,0),(2,3,0),(3,4,0)...
for ( i = 1; i <= segments; i ++ ) {
    indices.push( i, i + 1, 0 );
}
```

<全文结束>
