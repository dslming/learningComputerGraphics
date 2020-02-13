import * as THREE from './lib/three.module.js.js'
import { Stage } from './Stage.js.js'
import ShaderDash from './shader-dash.js.js'

window.THREE = THREE

class App {
  constructor() {
    this.srcTexturen = null
    this.stage = new Stage("#app")
    window.lm = this.stage
    this.addDashLine()
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

  addDashLine() {
    var lineGeometry = new THREE.Geometry();//生成几何体
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 25));//线段的两个顶点
    lineGeometry.vertices.push(new THREE.Vector3(0, 1, 25));


    let material = new THREE.ShaderMaterial(ShaderDash.getShaderData({
      side: THREE.DoubleSide
    }))

    var line = new THREE.Line(lineGeometry, material);
    // 不可或缺的，若无，则线段不能显示为虚线
    line.computeLineDistances();
    this.stage.scene.add(line);

    const renderer = this.stage.renderer
    renderer.compile(this.stage.scene, this.stage.camera);
    const gl = renderer.getContext()
    // const shader = gl.getShaderSource(material.program.fragmentShader)
    // const shader = gl.getShaderSource(material.program.vertexShader)
    // console.error(shader);

  }
}

window.onload = () => {
  new App()
}
