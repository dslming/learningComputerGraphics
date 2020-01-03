import { Stage } from './Stage.js'
import { Midpoint, Point } from './Midpoint.js'

class App {
  constructor() {
    let stage = new Stage()
    let mp = new Midpoint(stage.scene)
    const p0 = new Point(0, 0)
    const p1 = new Point(20, 100)
    mp.addLinePoints(p0, p1)
    stage.run()
  }
}

new App()
