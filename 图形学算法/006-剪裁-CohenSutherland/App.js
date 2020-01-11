import { Stage } from './Stage.js'
import { CohenSutherland } from './CohenSutherland.js'

class App {
  constructor() {
    let stage = new Stage()
    // 剪裁区域大小
    let size = {
      xMax: 110,
      xMin: 10,
      yMax: 110,
      yMin: 10
    }
    stage.addPlanBox(size)
    stage.addCameraHelper()
    let cs = new CohenSutherland(size)
    this.drawLine(cs, stage)
    stage.run()
  }

  drawLine(cs, stage) {
    // 1)完全在区域内
    let pointStart = new THREE.Vector3(50, 50, 0);
    let pointEnd = new THREE.Vector3(90, 90, 0);

    // 2)完全在区域外
    let pointStart2 = new THREE.Vector3(-50, 120, 0);
    let pointEnd2 = new THREE.Vector3(80, 150, 0);

    // 3)上面情况都不满足
    let pointStart3 = new THREE.Vector3(-10, 80, 0);
    let pointEnd3 = new THREE.Vector3(80, -30, 0);

    let lines = [
      {
        p1: pointStart,
        p2: pointEnd
      },
      {
        p1: pointStart2,
        p2: pointEnd2
      },
      {
        p1: pointStart3,
        p2: pointEnd3
      }
    ]

    lines.forEach(line => {
      // 在剪裁区域内的直线
      let newLine = cs.cohenSutherland(line.p1, line.p2)

      newLine && stage.drawLine({
        p1: newLine.p1,
        p2: newLine.p2,
        color: `#ff0000`
      })
    });
  }
}

new App()
