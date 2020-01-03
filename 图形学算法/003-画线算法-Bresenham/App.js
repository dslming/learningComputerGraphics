import { Stage } from './Stage.js'
import { Bresenham, Point } from './Bresenham.js'

class App {
  constructor() {
    let stage = new Stage()
    let mp = new Bresenham(stage.scene)
    const p0 = new Point(0, 0)
    const p1 = new Point(20, 5)
    mp.addLinePoints(p0, p1)
    stage.run()
  }
}

new App()
