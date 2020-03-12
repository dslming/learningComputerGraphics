import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import Box from './Box.js'
import UI from './UI.js'

const Signal = window.signals.Signal
window.THREE = THREE

class App {
  constructor() {
    window.lm = this
    this.stage = new Stage("#app")
    this.stage.run()
    const event = new Signal()
    const box = new Box(this.stage, event)
    const ui = new UI(event)
  }
}

window.onload = () => {
  new App()
}
