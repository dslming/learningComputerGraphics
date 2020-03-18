import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import Box from './Box.js'
import Camera from './Camera.js'

window.THREE = THREE

class App {
  constructor() {
    window.lm = this
    this.stage = new Stage("#app")
    this.stage.run()
    this.cam = new Camera(this.stage)
    const box = new Box(this.stage, this.cam.ctl)
  }
}

window.onload = () => {
  new App()
}
