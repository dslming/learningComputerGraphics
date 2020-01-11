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
      // box.rotation.y = Math.PI / 2
      // box.rotation.z = Math.PI / 2
      stage.scene.add(box)
      stage.run()
      stage.onUpdate(() => {
        // box.rotation.y -= 0.003
      })
    })
  }
}

export default App


// import * as THREE from 'three'
// import ProjectedMaterial from './ProjectedMaterial.js'
// import WebGLApp from './lib/WebGLApp.js'
// import assets from './lib/AssetManager.js'

// let App = {}
// App.init = () => {

//   // grab our canvas
//   const canvas = document.querySelector('#app-box')
//   // console.error(canvas);

//   // setup the WebGLRenderer
//   const webgl = new WebGLApp({
//     canvas,
//     // set the scene background color
//     background: '#222',
//     orbitControls: {
//       distance: 4,
//       phi: Math.PI / 2.5,
//       zoom: true
//     },
//   })

//   // attach it to the window to inspect in the console
//   window.webgl = webgl

//   // hide canvas
//   // webgl.canvas.style.visibility = 'hidden'

//   // preload the texture
//   const textureKey = assets.pushQueue({
//     url: 'images/uv.jpg',
//     type: 'texture',
//   })

//   // load any queued assets
//   assets.load({ renderer: webgl.renderer }).then(() => {
//     // show canvas
//     webgl.canvas.style.visibility = ''

//     // create a new camera from which to project
//     const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 3)
//     camera.name = "appCamera"
//     camera.position.set(-1, 1.2, 1.5)
//     camera.lookAt(0, 0, 0)
//     webgl.scene.add(camera)

//     // add a camer frustum helper just for demostration purposes
//     const helper = new THREE.CameraHelper(camera)
//     webgl.scene.add(helper)

//     // create the mesh with the projected material
//     const geometry = new THREE.BoxGeometry(1, 1, 1)
//     const material = new ProjectedMaterial({
//       camera,
//       texture: assets.get(textureKey),
//       color: '#37E140',
//     })
//     const box = new THREE.Mesh(geometry, material)
//     webgl.scene.add(box)

//     // move the mesh any way you want!
//     box.rotation.y = Math.PI / 6

//     // rotate for demo purposes
//     webgl.onUpdate(() => {
//       box.rotation.y -= 0.003
//     })

//     // start animation loop
//     webgl.start()
//     webgl.draw()
//   })
// }

// export default App

