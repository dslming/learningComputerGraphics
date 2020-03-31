import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import BoxData from './BoxData.js'
import { vertexShader } from './glsl.vertexShader.js'
import { fragmentShader } from './glsl.fragmentShader.js'

window.THREE = THREE
class App {
  constructor() {
    window.lm = this
    this.stage = new Stage("#app")
    this.addBox(this.stage)
    // this.addMyBox(this.stage)
    this.stage.run()

    let pos = [
      // front
      1, 1, 1,
      1, -1, 1,
      1, -1, -1,
      1, 1, -1,

      // back
      -1, 1, -1,
      - 1, -1, -1,
      -1, -1, 1,
      - 1, 1, 1,
    ];

    let x = 0
    let y = 0
    let z = 0
    let color = 0x000000

    for (let i = 0, j = 0; i < pos.length; i += 3, j++) {
      if (j < 4) {
        color = 0xff0000
      } else {
        color = 0xffff00
      }
      x = pos[i]
      y = pos[i + 1]
      z = pos[i + 2]

      if (pos[i] == -1) {
        x = pos[i] - 1
      } else if (pos[i] != -1) {
        x = pos[i] + 0
      }

      this.addText(`(${pos[i]},${pos[i + 1]},${pos[i + 2]})[${j}]`, { x, y, z }, color)
    }
  }

  addText(text, position, color) {
    // load font
    var loader = new THREE.FontLoader();
    loader.load('./lib/optimer_bold.typeface.json', (font) => {
      var mat = new THREE.MeshBasicMaterial({
        color,
      });
      let geo = new THREE.TextGeometry(text, { size: 0.2, height: 0.1, font })
      var mesh = new THREE.Mesh(geo, mat)
      // mesh.scale.z = 0.1
      mesh.position.set(position.x, position.y, position.z)
      mesh.rotation.set(0, 1.52, 0)
      this.stage.scene.add(mesh)
    })
  }
  // 增加一个立方体
  addBox(stage) {
    var material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
    });
    let geometry = new THREE.BoxGeometry(20, 20, 20)
    let cube = new THREE.Mesh(geometry, material);
    // cube.material.wireframe = true
    cube.name = "cube"
    stage.scene.add(cube)
    stage.onUpdate(() => {
      cube.rotation.y -= 0.003
    })
  }

  addMyBox(stage) {
    let material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    let meshData = new BoxData({
      radius: 5,
      segments: 64,
      thetaLength: Math.PI * 2
    })

    let { position, indices } = meshData.getData()
    var geometry = new THREE.BufferGeometry();

    // 设置顶点索引
    geometry.setIndex(indices)
    // 设置顶点坐标
    geometry.setAttribute('myPosition', new THREE.Float32BufferAttribute(position, 3));

    let cube = new THREE.Mesh(geometry, material);
    cube.material.wireframe = true
    cube.name = "cube"
    stage.scene.add(cube)
    stage.onUpdate(() => {
      // cube.rotation.y += 0.0001
      // cube.rotation.x += 0.0001
      // cube.rotation.z += 0.0001
    })
  }
}

window.onload = () => {
  new App()
}
