import * as THREE from 'three'
import { random } from 'lodash'
import { Stage } from './Stage'
import { ProjectedMaterial, project } from './ProjectedMaterial'
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
    camera.position.set(0, 0, 4)
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
      // const geometry = new THREE.BoxGeometry(1, 1, 1)
      // const material = new ProjectedMaterial({
      //   camera: camera,
      //   texture: assets.get(textureKey),
      //   color: '#37E140',
      // })

      const elements = new THREE.Group()
      const NUM_ELEMENTS = 50
      for (let i = 0; i < NUM_ELEMENTS; i++) {
        const geometry = new THREE.IcosahedronGeometry(random(0.1, 0.5))
        const material = new ProjectedMaterial({
          // use the scene camera itself
          camera: camera,
          texture: assets.get(textureKey),
          color: '#3149D5',
        })
        const element = new THREE.Mesh(geometry, material)

        // move the meshes any way you want!
        if (i < NUM_ELEMENTS * 0.4) {
          element.position.x = random(-0.7, 0.7)
          element.position.y = random(-1.3, 0.5)
          element.position.z = random(-0.3, 0.3)
          element.scale.multiplyScalar(1.4)
        } else {
          element.position.x = random(-1.5, 1.5, true)
          element.position.y = random(-2, 2, true)
          element.position.z = random(-0.5, 0.5)
        }
        element.rotation.x = random(0, Math.PI * 2)
        element.rotation.y = random(0, Math.PI * 2)
        element.rotation.z = random(0, Math.PI * 2)

        // and when you're ready project the texture!
        project(element)

        elements.add(element)
      }
      elements.name = "elements"
      stage.scene.add(elements)
      // const box = new THREE.Mesh(geometry, material)
      // box.name = "box"
      // stage.scene.add(box)
      // project(box)

      stage.run()
      stage.onUpdate(() => {
        elements.rotation.y -= 0.003
      })
    })
  }
}

export default App
