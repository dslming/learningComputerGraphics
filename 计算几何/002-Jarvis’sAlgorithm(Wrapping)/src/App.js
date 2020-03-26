import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import ConvexApp from './ConvexApp.js'

window.THREE = THREE

class App {
  constructor() {
    window.lm = this
    this.stage = new Stage("#app")
    this.stage.camera.position.set(5, 0, 22)
    this.stage.run()

    // 创建凸包应用
    new ConvexApp(this.stage)
  }
}

window.onload = () => {
  new App()
}
