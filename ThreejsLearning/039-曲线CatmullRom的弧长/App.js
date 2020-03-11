import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import CatmullRomCurve3 from './CatmullRomCurve3.js'

window.THREE = THREE

class App {
  constructor() {
    this.stage = new Stage("#app")
    window.lm = this
    this.addSpline()
    this.stage.run()
  }

  addSpline() {
    const basePoint = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3, 4, 0),
      new THREE.Vector3(6, 0, 0),
    ]
    var curve = new CatmullRomCurve3(basePoint);
    window.cc = curve
    var points = curve.getPoints(20);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var curveObject = new THREE.Line(geometry, material);
    this.stage.scene.add(curveObject)
  }
}

window.onload = () => {
  new App()
}
