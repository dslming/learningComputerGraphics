import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'

window.THREE = THREE

var color = new THREE.Color();
let that = null
let flag = 0
let count = 0
var dataTexture = []

class App {
  constructor() {
    that = this
    this.srcTexturen = null
    this.stage = new Stage("#app")
    window.lm = this.stage
    this.addBox()
    this.stage.run()
  }

  // 增加一个立方体
  addBox() {
    var loader = new THREE.TextureLoader();
    const texture = loader.load('00.jpg');
    this.srcTexturen = texture
    // 控制透明
    // texture.minFilter = THREE.LinearFilter;
    // texture.generateMipmaps = false;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    let geometry = new THREE.BoxGeometry(10, 10, 10)
    let cube = new THREE.Mesh(geometry, material);
    cube.name = "cube"
    this.stage.scene.add(cube)
    this.stage.onUpdate(() => {
      this.updataTextture()
    })
  }

  updataTextture() {
    var width = 200;
    var height = 350;
    var data = new Uint8Array(width * height * 3);
    dataTexture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
    let texture = dataTexture
    var size = texture.image.width * texture.image.height;
    var data = texture.image.data;
    if (flag == 0 && count > 20) {
      color.setHex(0xff0000)
      flag = 1
      count = 0
    } else if (count > 20) {
      flag = 0
      count = 0
      color.setHex(0xffffff)
    }
    count++
    var r = Math.floor(color.r * 255);
    var g = Math.floor(color.g * 255);
    var b = Math.floor(color.b * 255);

    for (var i = 0; i < size; i++) {
      var stride = i * 3;
      data[stride + 0] = r;
      data[stride + 1] = g;
      data[stride + 2] = b;
    }

    var position = new THREE.Vector2(150, 150);
    const renderer = that.stage.renderer
    renderer.copyTextureToTexture(position, dataTexture, that.srcTexturen);
  }
}

window.onload = () => {
  new App()
}
