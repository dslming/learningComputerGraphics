import { Stage } from './Stage.js'
import { Bresenham } from './Bresenham.js'

class App {
  constructor() {
    let stage = new Stage()
    let bresenham = new Bresenham(stage.scene)
    bresenham.addPoints()
    stage.run()
  }
}

new App()
