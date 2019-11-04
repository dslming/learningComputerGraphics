### 目标
建筑物的开场动画,相机围绕旋转

#### 1、导入模型
1) 寻找模型
3D 模型网站: https://www.turbosquid.com/3d-model/free/building?page_num=2

2) 格式转换
webgl最合适的格式是gltf,但是下载的模型文件是.obj,所以使用工具obj2gltf进行格式转换.
```js
// 1) 安装
npm i -g obj2gltf

// 2) 格式转换
obj2gltf -i ***.obj
```

