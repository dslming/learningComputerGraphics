import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'

window.THREE = THREE

var color = new THREE.Color();
let that = null
// var dataTexture = []

class App {
  constructor() {
    that = this
    this.srcTexturen = null
    this.stage = new Stage("#app")
    window.lm = this.stage
    this.addBox()
    this.stage.run()
  }

  generateDataTexture() {
    var width = 200;
    var height = 350;
    var data = new Uint8Array(width * height * 4);
    let dataTexture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    let texture = dataTexture
    var size = texture.image.width * texture.image.height;
    var data = texture.image.data;
    color.setHex(0xff0000)
    var r = Math.floor(color.r * 255);
    var g = Math.floor(color.g * 255);
    var b = Math.floor(color.b * 255);

    for (var i = 0; i < size; i++) {
      var stride = i * 4;
      data[stride + 0] = r;
      data[stride + 1] = g;
      data[stride + 2] = b;
      data[stride + 3] = 0.5;
    }
    return dataTexture
  }

  // 增加一个立方体
  addBox() {
    let texture = this.generateDataTexture()
    const material = new THREE.MeshBasicMaterial({ map: texture });
    let geometry = new THREE.BoxGeometry(10, 10, 10)
    let cube = new THREE.Mesh(geometry, material);
    cube.name = "cube"
    this.stage.scene.add(cube)
    this.stage.onUpdate(() => {
    })
  }
}

window.onload = () => {
  new App()
}
