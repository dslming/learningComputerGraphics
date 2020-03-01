import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import { bspline } from './b_spline.js'
import CatmullRomCurve3 from './CatmullRomCurve3.js'

window.THREE = THREE

class App {
  constructor() {
    this.stage = new Stage("#app")
    window.lm = this
    this.addSpline()
    // this.addSpline()
    this.stage.run()
  }

  addSpline() {
    //Create a closed wavey loop
    const basePoint = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 5, 0),
      new THREE.Vector3(10, 0, 0),
    ]
    // var curve = new THREE.CatmullRomCurve3(basePoint);
    var curve = new CatmullRomCurve3(basePoint);
    // console.error(curve.getPoints);
    var points = curve.getPoints(50);
    console.error(points);

    // 在场景中放置参考点
    basePoint.forEach(item => {
      var geometry = new THREE.BoxGeometry(1, 1, 1);
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      var cube = new THREE.Mesh(geometry, material);
      cube.scale.set(0.5, 0.5, 0.5)
      cube.position.set(item.x, item.y, 0)
      cube.name = "cube"
      this.stage.scene.add(cube);
    });

    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // Create the final object to add to the scene
    var curveObject = new THREE.Line(geometry, material);
    // curveObject.scale.set(0.1, 0.1, 0.1)
    this.stage.scene.add(curveObject)
  }

  // B样条
  addBSpline() {
    var points = [
      [-1.0, 0.0],
      [-0.5, 0.5],
      [0.5, -0.5],
      [1.0, 0.0]
    ];
    // 在场景中放置参考点
    points.forEach(item => {
      var geometry = new THREE.BoxGeometry(1, 1, 1);
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      var cube = new THREE.Mesh(geometry, material);
      cube.scale.set(0.05, 0.05, 0.05)
      cube.position.set(item[0], item[1], 0)
      cube.name = "cube"
      this.stage.scene.add(cube);
    });
    var degree = 2;
    let pointsV = []
    for (var t = 0; t < 1; t += 0.01) {
      var point = bspline(t, degree, points);
      pointsV.push(new THREE.Vector3(point[0], point[1], 0))
    }
    var geometry = new THREE.BufferGeometry().setFromPoints(pointsV);
    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var bsplineMesh = new THREE.Line(geometry, material);
    bsplineMesh.name = "bspline"
    this.stage.scene.add(bsplineMesh)
  }
}

window.onload = () => {
  new App()
}
