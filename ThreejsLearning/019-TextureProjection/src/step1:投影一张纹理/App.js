import * as THREE from 'three'
import { Stage } from './Stage'
import ProjectedMaterial from './ProjectedMaterial'
import assets from './lib/AssetManager'
window.lm = {}

class App {
  static init(id) {
    let stage = new Stage(id)
    window.lm.stage = stage
    stage.initOrbitControls({
      distance: 8,
      phi: Math.PI / 1.5,
      zoom: true,
    })
    let camera = App.addWatchCamera(stage)
    stage.addViceCamera(camera)
    App.loadAssets(stage, camera)

  }

  static addWatchCamera(stage) {
    const camera = new THREE.PerspectiveCamera(22, 1, 1, 4)
    camera.position.set(-3, 0, 0)
    camera.lookAt(0, 0, 0)
    let cameraHelper = new THREE.CameraHelper(camera)
    stage.scene.add(cameraHelper)
    stage.onUpdate(() => {
      cameraHelper.update()
      camera.updateMatrix()
    })
    return camera
  }

  static loadAssets(stage, camera) {
    window.lm.assets = assets
    const textureKey = assets.pushQueue({
      url: './images/02.jpg',
      type: 'texture',
    })
    assets.load({ renderer: stage.renderer }).then(() => {
      console.error("load over...");
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new ProjectedMaterial({
        camera: camera,
        texture: assets.get(textureKey),
        color: '#37E140',
      })
      // const material = new THREE.MeshBasicMaterial({
      //   map: assets.get(textureKey),
      // })


      const box = new THREE.Mesh(geometry, material)
      stage.scene.add(box)
      stage.run()
      stage.onUpdate(() => {
        box.rotation.y -= 0.003
      })
    })
  }
}

export default App
