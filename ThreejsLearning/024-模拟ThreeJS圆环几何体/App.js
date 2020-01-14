import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import CircleGeometry from './CircleGeometry.js'

window.THREE = THREE
class App {
  constructor() {
    let stage = new Stage("#app")
    this.addBox(stage)
    stage.run()
  }

  // 增加一个立方体
  addBox(stage) {
    let material = new THREE.MeshBasicMaterial({
      color: 0x00ff7c,
    });
    let geometry = new THREE.BoxGeometry(2, 2, 2);
    let cube = new THREE.Mesh(geometry, material);
    cube.name = "cube"
    stage.scene.add(cube)
    stage.onUpdate(() => {
      cube.rotation.y -= 0.003
    })

    let a = new CircleGeometry({
      radius: 0, segments: 10, thetaStart: 0, thetaLength: Math.PI * 2
    })
    console.error(a);

  }
}

window.onload = () => {
  new App()
}
