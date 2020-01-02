import { Stage } from './Stage.js'
import { DDA, Point } from './DDA.js'

class App {
  constructor() {
    let stage = new Stage()
    let dda = new DDA(stage.scene)
    const p0 = new Point(0, 0)
    const p1 = new Point(20, 100)
    dda.addLinePoints(p0, p1)
    stage.run()
  }
}

new App()
