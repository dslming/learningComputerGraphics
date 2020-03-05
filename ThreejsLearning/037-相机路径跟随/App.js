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
    let points = []
    let r = 20
    let z = 0
    for (let i = 0; i < 20; i += 1) {
      let x = r * Math.cos(i)
      let y = r * Math.sin(i)
      points.push(new THREE.Vector3(x, y, z))
      r -= 1
      z -= 1
    }
    var path = new THREE.CatmullRomCurve3(points);
    var geometry = new THREE.TubeGeometry(path, 200, 1, 20, false);
    var material = new THREE.MeshLambertMaterial({ color: 0xff00ff, side: THREE.BackSide, wireframe: true });
    var curveObject = new THREE.Mesh(geometry, material);
    this.stage.scene.add(curveObject)
    this.curve = curveObject

    // light
    var light = new THREE.PointLight(0xffffff, 1, 50);
    this.stage.scene.add(light);
    var splineCamera = new THREE.PerspectiveCamera(85, 1, 0.1, 1000)
    this.stage.scene.add(splineCamera);
    var cameraHelper = new THREE.CameraHelper(splineCamera);
    this.stage.scene.add(cameraHelper);


    this.stage.onUpdate(() => {
      // splineCamera.lookAt(new THREE.Vector3(0, 0, -10))
      // splineCamera.position.set(0, 0, 0)
      // splineCamera.up.set(0, 1, 0)
      // splineCamera.rotation.set
      // splineCamera.rotation.setFromRotationMatrix(splineCamera.matrix, splineCamera.rotation.order);

      this.renderFollowCamera(splineCamera, light, cameraHelper)

      // this.ttt(splineCamera, light)
      // this.stage.renderer.render(this.stage.scene, splineCamera);
    })
  }

  ttt(splineCamera) {
    var time = Date.now() * 0.5;
    var looptime = 20 * 1000;
    var t = (time % looptime) / looptime;

    const tube = this.curve.geometry

    var p1 = tube.parameters.path.getPointAt(t);
    var p2 = tube.parameters.path.getPointAt((t + 0.005) % 1);
    // console.error(pos);
    splineCamera.lookAt(p2);
    splineCamera.position.set(p1.x, p1.y, p1.z)
    light.position.set(p2.x, p2.y, p2.z);
  }

  // Animate the camera along the spline
  renderFollowCamera(splineCamera, light, cameraHelper) {
    // splineCamera = this.stage.camera
    // animate camera along spline
    const tubeGeometry = this.curve.geometry
    const params = {
      scale: 1
    }
    var time = Date.now();
    var looptime = 20 * 1000;
    var t = (time % looptime) / looptime;

    var pos = tubeGeometry.parameters.path.getPointAt(t);
    pos.multiplyScalar(params.scale);

    // interpolation

    var segments = tubeGeometry.tangents.length;
    var pickt = t * segments;
    var pick = Math.floor(pickt);
    var pickNext = (pick + 1) % segments;

    binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
    binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);

    var dir = tubeGeometry.parameters.path.getTangentAt(t);
    var offset = 0;

    normal.copy(binormal).cross(dir);

    // we move on a offset on its binormal

    pos.add(normal.clone().multiplyScalar(offset));

    splineCamera.position.copy(pos);
    light.position.copy(pos);
    // using arclength for stablization in look ahead

    var lookAt = tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1).multiplyScalar(params.scale);

    // camera orientation 2 - up orientation via normal

    if (!params.lookAhead) lookAt.copy(pos).add(dir);
    splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
    splineCamera.quaternion.setFromRotationMatrix(splineCamera.matrix);
    cameraHelper.update()

  }
}

window.onload = () => {
  new App()
}
