[参考](https://www.jianshu.com/p/704a24143e40)


### ThreeJS 中显示小窗口

<img src="01.png">

这种效果的主要代码:
```js
function initStage() {
  ...
  // 不要自动清除
 renderer.autoClear = false;
 renderer.setClearColor(0x000000, 0.0);

 // 创建2个相机 mainCamera, viceCamera
 ...
}

// 循环渲染函数
function loop() {
  ...
  // 主镜头的显示范围
  let w = window.innerWidth
  let h = window.innerHeight
  // 小窗口的显示范围
  let mapHeight = 100
  let mapWidth = 100

  renderer.clear();
  renderer.setViewport(0, 0, w, h);
  renderer.render(scene, mainCamera);
  renderer.setViewport(10, h - mapHeight - 10, mapWidth, mapHeight);
  renderer.render(scene, viceCamera);
  requestAnimationFrame(loop)
  ...
}
```
<全文结束>
