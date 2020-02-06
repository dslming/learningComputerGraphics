import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import Line from './Line.js'

window.THREE = THREE
let line1 = new Line()
let line2 = new Line()
let line3 = new Line()
let line4 = new Line()

let that = null
let count = 0
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
    var height = 200;
    var data = new Uint8Array(width * height * 4);
    let dataTexture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    for (let i = 0, j = 0; i < dataTexture.image.data.length; i += 4, j++) {
      dataTexture.image.data[i + 0] = 255
      dataTexture.image.data[i + 1] = 255
      dataTexture.image.data[i + 2] = 255
      dataTexture.image.data[i + 3] = 1
    }

    const rect = {
      x: 50,
      y: 100,
      w: 50,
      h: 50
    }

    line1.drawLine({
      start: {
        x: rect.x,
        y: rect.y
      },
      end: {
        x: rect.x + rect.w,
        y: rect.y
      },
      lineWidth: 2,
      color: "ff0000",
      imgWidth: 200,
      imgData: dataTexture.image.data
    })
    line2.drawLine({
      start: {
        x: rect.x,
        y: rect.y
      },
      end: {
        x: rect.x,
        y: rect.y + rect.h
      },
      lineWidth: 2,
      color: "ff0000",
      imgWidth: 200,
      imgData: dataTexture.image.data
    })
    line3.drawLine({
      start: {
        x: rect.x + rect.h,
        y: rect.y
      },
      end: {
        x: rect.x,
        y: rect.y + rect.h
      },
      lineWidth: 2,
      color: "ff0000",
      imgWidth: 200,
      imgData: dataTexture.image.data
    })
    line4.drawLine({
      start: {
        x: rect.x,
        y: rect.y + rect.h
      },
      end: {
        x: rect.x + rect.w,
        y: rect.y + rect.h
      },
      lineWidth: 2,
      color: "ff0000",
      imgWidth: 200,
      imgData: dataTexture.image.data
    })
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
      count++
      if (count > 20) {
        let texture = this.generateDataTexture()
        cube.material.map = texture
      }

      if (count > 20) {
        count = 0
      }
    })
  }
}

window.onload = () => {
  new App()
}
