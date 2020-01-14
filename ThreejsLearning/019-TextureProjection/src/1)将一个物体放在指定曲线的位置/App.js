import * as THREE from 'three'
import { alignOnCurve } from './lib/three-utils'
import { random } from 'lodash'
import { Stage } from './Stage.js'
import { ProjectedMaterial, project } from './ProjectedMaterial.js'
import assets from './lib/AssetManager.js'
window.lm = {}

class App {
  static init(id) {
    let stage = new Stage(id)
    window.lm.stage = stage
    stage.initOrbitControls({
      distance: 50,
      zoom: true,
    })
    App.loadAssets(stage)
  }


  static loadAssets(stage) {
    assets.load({ renderer: stage.renderer }).then(() => {

      // stage.scene.add()
      App.addLine(stage)
      stage.run()
      stage.onUpdate(() => {
      })
    })
  }

  static addLine(stage) {
    //Create a closed wavey loop
    var curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 0, 10),
      new THREE.Vector3(-5, 5, 5),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, -5, 5),
      new THREE.Vector3(10, 0, 10)
    ]);
    window.lm.curve = curve

    var points = curve.getPoints(50);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    // Create the final object to add to the scene
    var curveObject = new THREE.Line(geometry, material);
    stage.scene.add(curveObject)

    const boxGeometry = new THREE.BoxGeometry(2, 2, 2)
    const boxMaterial = new THREE.MeshBasicMaterial()
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    stage.scene.add(box)

    alignOnCurve(box, curve, 0.9)
  }
}

export default App
