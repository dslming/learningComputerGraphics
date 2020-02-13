import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import { Line, LineMaterial } from './Line.js'
// wide line
window.THREE = THREE

const colors = [
  0xed6a5a,
  0xf4f1bb,
  0x9bc1bc,
  0x5ca4a9,
  0xe6ebe0,
  0xf0b67f,
  0xfe5f55,
  0xd6d1b1,
  0xc7efcf,
  0xeef5db,
  0x50514f,
  0xf25f5c,
  0xffe066,
  0x247ba0,
  0x70c1b3
];

class App {
  constructor() {
    this.srcTexturen = null
    this.stage = new Stage("#app")
    window.lm = this.stage
    this.addMyLine()
    this.stage.run()
  }

  addLine() {
    var lineGeometry = new THREE.Geometry();//生成几何体
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 25));//线段的两个顶点
    lineGeometry.vertices.push(new THREE.Vector3(0, 1, 25));

    let material = new THREE.LineDashedMaterial({
      color: 0xffffff,//线段的颜色
      dashSize: 1,//短划线的大小
      gapSize: 3//短划线之间的距离
    })
    var line = new THREE.Line(lineGeometry, material);

    // 不可或缺的，若无，则线段不能显示为虚线
    line.computeLineDistances();
    this.stage.scene.add(line);
  }

  addMyLine() {
    var lineGeo = new Float32Array(600);
    for (var j = 0; j < 200 * 3; j += 3) {
      lineGeo[j] = -30 + .1 * j;
      lineGeo[j + 1] = 5 * Math.sin(.01 * j);
      lineGeo[j + 2] = 0;
    }

    var g = new Line();
    g.setGeometry(lineGeo);

    var material = new LineMaterial({
      useMap: false,
      color: new THREE.Color(colors[0]),
      opacity: 1,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      sizeAttenuation: !false,
      lineWidth: 2,
      near: this.stage.camera.near,
      far: this.stage.camera.far
    });
    var mesh = new THREE.Mesh(g.geometry, material);
    mesh.name = "line"
    this.stage.camera.position.set(0, 0, 100);
    this.stage.scene.add(mesh);
    let t = 0
    this.stage.onUpdate(() => {
      t++
      let lineWidth = Math.sin(t * 0.05) + 2
      mesh.material.uniforms.lineWidth.value = lineWidth
      // mesh.rotation.x += 0.005
    })
  }
}

window.onload = () => {
  new App()
}
