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
    var material = new THREE.MeshLambertMaterial({ color: 0xff00ff, side: THREE.BackSide, wireframe: false });
    var curveObject = new THREE.Mesh(geometry, material);
    this.stage.scene.add(curveObject)
    this.curve = curveObject

    // light
    var light = new THREE.PointLight(0xffffff, 1, 80);
    this.stage.scene.add(light);
    var splineCamera = new THREE.PerspectiveCamera(85, 1, 5, 1000)
    this.stage.scene.add(splineCamera);
    var cameraHelper = new THREE.CameraHelper(splineCamera);
    this.stage.scene.add(cameraHelper);


    this.stage.onUpdate(() => {
      this.renderFollowCamera(splineCamera, light, cameraHelper)
      // this.ttt(splineCamera, light)
      // this.stage.renderer.render(this.stage.scene, splineCamera);
    })
  }

  ttt(splineCamera, light) {
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

  renderFollowCamera(splineCamera, light, cameraHelper) {
    const tubeGeometry = this.curve.geometry
    const params = {
      scale: 1,
      lookAhead: false
    }
    var time = Date.now() * 0.5;
    var looptime = 20 * 1000;
    var t = (time % looptime) / looptime;

    var pos = tubeGeometry.parameters.path.getPointAt(t);
    var p2 = tubeGeometry.parameters.path.getPointAt((t + 0.02) % 1);
    pos.multiplyScalar(params.scale);

    var segments = tubeGeometry.tangents.length;

    var pickt = t * segments;
    var pick = Math.floor(pickt);
    var pickNext = (pick + 1) % segments;

    binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
    binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);

    var dir = tubeGeometry.parameters.path.getTangentAt(t);
    normal.copy(binormal).cross(dir);
    splineCamera.position.copy(pos);
    light.position.copy(p2);

    // using arclength for stablization in look ahead
    // 使用弧长来稳定向前看
    var lookAt = tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1).multiplyScalar(params.scale);

    // camera orientation 2 - up orientation via normal
    // 相机方向2-通过法线向上

    if (!params.lookAhead) lookAt.copy(pos).add(dir);
    splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
    splineCamera.quaternion.setFromRotationMatrix(splineCamera.matrix);
    cameraHelper.update()

  }
}

window.onload = () => {
  new App()
}
