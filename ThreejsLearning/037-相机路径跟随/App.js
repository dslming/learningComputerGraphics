import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'

window.THREE = THREE

var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

class App {
  constructor() {
    this.curve = null
    this.stage = new Stage("#app")
    window.lm = this
    this.addSpline()
    this.stage.run()
  }

  addSpline() {
    let basePoint = []
    let r = 15
    let z = 0
    for (let i = 0; i < 20; i += 1) {
      let x = r * Math.cos(i)
      let y = r * Math.sin(i)
      basePoint.push(new THREE.Vector3(x, y, z))
      r -= 0.5
      z -= 1
    }

    var path = new THREE.CatmullRomCurve3(basePoint);
    lm.path = path
    var geometry = new THREE.TubeGeometry(path, 200, 0.5, 8, false);
    var material = new THREE.MeshLambertMaterial({ color: 0xff00ff, side: THREE.DoubleSide });
    var curveObject = new THREE.Mesh(geometry, material);
    var wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.3, wireframe: true, transparent: true });
    var wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    curveObject.add(wireframe);

    this.stage.scene.add(curveObject)
    this.curve = curveObject
    this.stage.onUpdate(() => {
      this.renderFollowCamera()
    })
  }

  // Animate the camera along the spline
  renderFollowCamera() {
    var time = Date.now();
    var looptime = 20 * 1000;
    var t = (time % looptime) / looptime;
    const tube = this.curve.geometry
    window.tt = tube
    const splineCamera = this.stage.camera
    const speed = 3
    var pos = tube.parameters.path.getPointAt(t);
    // console.error(pos);

    pos.multiplyScalar(speed);

    // interpolation 插补
    var segments = tube.tangents.length;
    var pickt = t * segments;
    var pick = Math.floor(pickt);
    var pickNext = (pick + 1) % segments;

    binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
    binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);

    var dir = tube.parameters.path.getTangentAt(t);
    normal.copy(binormal).cross(dir);

    // We move on a offset on its binormal
    const offset = 5
    pos.add(normal.clone().multiplyScalar(offset));

    splineCamera.position.copy(pos);

    // Using arclength for stablization in look ahead.
    var lookAt = tube.parameters.path.getPointAt((time + 30 / tube.parameters.path.getLength()) % 1).multiplyScalar(speed);

    // Camera Orientation 2 - up orientation via normal
    // if (!lookAhead)
    lookAt.copy(pos).add(dir);
    splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
    splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);

    // parent.rotation.y += (targetRotation - parent.rotation.y) * 0.05;
  }
}

window.onload = () => {
  new App()
}
