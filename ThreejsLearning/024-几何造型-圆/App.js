import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import CircleData from './CircleData.js'
import { vertexShader } from './glsl.vertexShader.js'
import { fragmentShader } from './glsl.fragmentShader.js'

window.THREE = THREE
class App {
  constructor() {
    let stage = new Stage("#app")
    window.lm = stage
    // this.addBox(stage)
    this.addCircle(stage)
    stage.run()
  }

  // 增加一个立方体
  addBox(stage) {
    var material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
    });
    let geometry = new THREE.BoxGeometry(2, 2, 2)
    let cube = new THREE.Mesh(geometry, material);
    cube.name = "cube"
    stage.scene.add(cube)
    stage.onUpdate(() => {
      cube.rotation.y -= 0.003
    })
  }

  addCircle(stage) {
    let material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    let circleData = new CircleData({
      radius: 5,
      segments: 64,
      thetaLength: Math.PI * 2
    })
    // console.error(circleData);

    let { position, indices } = circleData.getData()
    var geometry = new THREE.BufferGeometry();

    // 设置顶点索引
    geometry.setIndex(indices)
    // 设置顶点坐标
    geometry.setAttribute('myPosition', new THREE.Float32BufferAttribute(position, 3));

    let circle = new THREE.Mesh(geometry, material);
    circle.name = "circle"
    stage.scene.add(circle)

    // var geometry1 = new THREE.CircleGeometry(5, 32);
    // var material1 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    // var circle1 = new THREE.Mesh(geometry1, material1);
    // circle1.name = "circle1"
    // stage.scene.add(circle1);
  }
}

window.onload = () => {
  new App()
}
