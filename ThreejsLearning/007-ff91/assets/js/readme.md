#### 将webpack打包的反编译
debundle -i ff91tour.js -o dist/ -c 1.json

# 36 initApp
程序入口。
 - [ ] 4 control

## 4 control
 - [x] 38 ViewTour
 - [ ] 37 ViewPreload
 - [ ] 32 Nav
 - [ ] 31 CardControls
 - [x] 40 assetLoader (资源加载)
 - [ ] 42 Monoc (相机)
 - [ ] 39 Analytics
 - [ ] 2 CardProps

### 38 ViewTour
CSS3DRenderer

依赖模块：
- [x] 30 Card
- [ ] 2 Desktop,Mobile
- [ ] 1 CarProps
- [x] 26 CarBody
- [ ] 33 Floor
- [x] 35 Skybox

笔记：
- CSS场景和渲染器
- 所有汽车提示的卡片控制
- 环境光和平行光
- 天空盒

### 37 ViewPreload
加载之前的显示内容
- [ ] 34 Grid
- [ ] 0 Time

### 42 Monoc
- [ ] 0 Time
- [ ] 41 CamControl

#### 30 Card
- [ ] 2 Desktop,Mobile

#### 1 CarProps
- [ ] 0 Time

#### 26 CarBody
- [ ] 29 CarWheels
- [ ] 27 CarLights
- [ ] 28 Motors
- [ ] 25 Batts

#### 33 Floor
- [ ] 20 glsl
- [ ] 19 glsl

#### 35 Skybox
- [x] 24 glsl
- [x] 23 glsl

#### 34 Grid
- [ ] 22 glsl
- [ ] 21 glsl

##### 29 CarWheels
- [ ] 1 CarProps
- [ ] 0 Time

##### 27 CarLights
- [ ] 10 glsl (headLightsVS)
- [ ] 9 glsl (headLightsFS)
- [ ] 16 glsl (tailLightVS)
- [ ] 14 glsl (tailGridVS)
- [ ] 15 glsl (tailGridFS)
- [ ] 8 glsl (flareVS)
- [ ] 7 glsl (flareFS)
- [ ] 18 glsl (turnBarVS)
- [ ] 13 glsl (stopBarVS)
- [ ] 17 glsl (turnBarFS)

##### 28 Motors
- [ ] 0 Time
- [ ] 1 CarProps
- [ ] 12 glsl
- [ ] 11 glsl

##### 25 Batts
- [ ] 0 Time
- [ ] 1 CarProps
- [ ] 6 glsl
- [ ] 5 glsl

<全文结束>
