import * as THREE from 'three'
import { alignOnCurve, visibleHeightAtZDepth, visibleWidthAtZDepth } from './lib/three-utils'
import { random } from 'lodash'
import { Stage } from './Stage.js'
import { ProjectedMaterial, project } from './ProjectedMaterial.js'
import assets from './lib/AssetManager.js'
window.lm = {}

class App {
  static init(id) {
    let stage = new Stage(id)
    window.lm.stage = stage
    // stage.initOrbitControls({
    //   distance: 50,
    //   zoom: true,
    // })
    App.loadAssets(stage)
  }


  static loadAssets(stage) {
    assets.load({ renderer: stage.renderer }).then(() => {
      App.addObj(stage)
      stage.run()
      stage.onUpdate(() => {
      })
    })
  }

  static addObj(stage) {
    let boxHeight = visibleHeightAtZDepth(10, stage.camera)
    let boxWidth = visibleWidthAtZDepth(10, stage.camera)
    const boxGeometry = new THREE.BoxGeometry(boxHeight - 10, boxWidth - 10, 1)
    const boxMaterial = new THREE.MeshBasicMaterial()
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    stage.scene.add(box)
    console.error("boxHeight:", boxHeight);

  }
}

export default App
