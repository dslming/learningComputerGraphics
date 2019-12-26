> 翻译自: https://tympanus.net/codrops/2019/11/13/high-speed-light-trails-in-three-js/

> 代码: https://github.com/dslming/learningComputerGraphics/tree/master/ThreejsLearning/017-InfiniteLights

### 无限灯光-第三阶段

[完整代码](step3-Moving Lights)

#### 1、移动灯光
因为我们在z轴上创建了管的曲线，所以移动灯光仅是在z轴上添加和减去的问题。我们将使用经过的时间，uTime因为时间总是在移动，而且非常一致。

让我们从添加uTime统一和更新方法开始。然后，我们的App class 可以同时更新两个时间CarLights。最后，我们将时间添加到顶点着色器的z轴上。

CarLights.js
```js
class CarLights {
  init() {
    ...
    const material = new THREE.ShaderMaterial({
      ...
      uniforms: {
        ...
        uTime: new THREE.Uniform(0)
      }
    });
    ...
  }

  update(time) {
    this.mesh.material.uniforms.uTime.value = time;
  }
}
```

片元着色器:
```js
...
float zOffset = uTime + aOffset.z;
transformed.z = transformed.z +zOffset
...
```

App.js:
```js
class App {
  ...
  update() {
    that.clock.getDelta();
    // time: 时钟运行的总时长。
    let time = that.clock.elapsedTime
    console.error(time);

    that.leftLights.update(time);
    that.rightLights.update(time);
  }
}
```
这样就可以移动了!


#### 2、不同方向的灯光
让我们创建一个新的制服uSpeed并将其乘以uTime使动画更快。由于每条路都必须走到另一侧，因此我们还将其添加到CarLights构造函数中以使其可自定义。

```js
class CarLights {
  constructor(webgl, options, color, speed) {
    ...
    this.speed = speed;
  }

  init() {
    ...
    const material = new THREE.ShaderMaterial({
      ...
      uniforms: {
        ...
        uSpeed: new THREE.Uniform(this.speed)
      }
    });
    ...
  }
}
```

着色器:
```js
...
float zOffset = uTime * uSpeed + aOffset.z;
// 在 z 轴做平移
transformed.z += zOffset;
...
```

App:
```js
class App {
  constructor() {
    ...
    // 增加速度系数,并且是两个反方向的
    let speed = 60
    this.leftLights = new CarLights(this.stage, options, 0xff102a, speed);
    this.rightLights = new CarLights(this.stage, options, 0xfafafa, -speed);
    ...
  }
}
```
现在它很快了。

#### 3、循环起来
管道的长度`len`,  道路的长度`uTraveLength`, 管道每次移动的距离`zOffset`的计算:
```js
float zOffset = uTime * uSpeed;
zOffset = len - mod(zOffset, uTravelLength);
```

<全文结束, 多多点赞会变好看, 多多评论会变有钱>
