// import * as THREE from "../../../three.js/src/Three.js"
import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import { PerspectiveCamera } from './myCamera.js'
import { vertexShader } from './glsl.vertexShader.js'
import { fragmentShader } from './glsl.fragmentShader.js'

class App {
  constructor() {
    let stage = new Stage("#app")

    // 新建一个自定义的相机
    let camera = this.initCamera("#app")
    this.addBox(stage, camera)
    stage.run()
  }

  initCamera(ele) {
    let eleC = document.querySelector(ele);
    let camera = new PerspectiveCamera({
      fov: 45,
      aspect: eleC.clientWidth / eleC.clientHeight,
      near: 0.1,
      far: 2000,
      position: {
        x: 0,
        y: 0,
        z: 10
      }
    })
    window.lm = camera
    return camera
  }
  // 增加一个立方体
  addBox(stage, camera) {

    var geometry = new THREE.BoxGeometry(2, 2, 2);
    let uniforms = {
      myProjectionMatrix: {
        type: 'm4',
        value: camera.getProjectionMatrix()
      },
      myModelViewMatrix: {
        type: 'm4',
        value: camera.getModelViewMatrix()
      },
      color: {
        type: "c",
        value: new THREE.Color(0xff0000)
      }
    }
    // var material = new THREE.MeshBasicMaterial({
    //   color: 0x00ff7c,
    // });

    // 将相机参数传给着色器
    let material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    var cube = new THREE.Mesh(geometry, material);
    cube.name = "cube"
    stage.scene.add(cube)
    stage.onUpdate(() => {
      cube.rotation.y -= 0.003
      uniforms.myModelViewMatrix.value = camera.getModelViewMatrix(cube)
    })
    return cube
  }
}

window.onload = () => {
  new App()
}
