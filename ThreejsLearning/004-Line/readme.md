### 线的旋转
#### 1、旋转
```js
TweenMax.to(line.rotation, 1, {x: 45*DEG_TO_RAD, 'yoyo': false})
```

#### 2、改变顶点坐标
```js
geometry.vertices[1].applyAxisAngle({x:1, y:0, z: 0},45*DEG_TO_RAD)
```