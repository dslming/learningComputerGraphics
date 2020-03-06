import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'

window.THREE = THREE
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

class App {
  constructor() {
    window.lm = this
    this.curve = null
    this.stage = new Stage("#app")
    this.addPlan()
    this.stage.run()
  }

  addPlan() {
    var planeGeometry = new THREE.PlaneGeometry(100, 100, 20, 20);
    var planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    this.stage.scene.add(plane)
    this.stage.camera.position.set(0, 90, 120);
    var ts = 0
    this.stage.onUpdate(() => {
      ts += 10
      var vLength = plane.geometry.vertices.length;
      for (var i = 0; i < vLength; i++) {
        var v = plane.geometry.vertices[i];
        v.z = Math.sin(ts / 500 + (v.x * (vLength / 2)) * (v.y / (vLength / 2))) * 3 + 5;
      }
      plane.geometry.verticesNeedUpdate = true;
    })
  }
}

window.onload = () => {
  new App()
}
