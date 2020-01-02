import { Stage } from './Stage.js'
import { DDA } from './DDA.js'

class App {
  constructor() {
    let stage = new Stage()
    let dda = new DDA(stage.scene)
    dda.addPoints()
    stage.run()
  }
}

new App()
