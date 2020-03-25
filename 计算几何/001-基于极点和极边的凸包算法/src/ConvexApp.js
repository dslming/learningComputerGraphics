import { angle_360, getGravityCenter } from './utils.js'
import { convexHull, markEE } from './convex_hull.js'

function getAngles(points) {
  const g = getGravityCenter(points)
  let v1 = new THREE.Vector3(g.x | 1, g.y, g.z)
  for (let i = 0; i < points.length; i++) {
    points[i].angle = angle_360(v1, points[i])
  }
}

export default class ConvexApp {
  constructor(stage) {
    this.stage = stage

    // 任意的点
    let points = []
    points.push(new THREE.Vector3(0, 100, 0));
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(-100, -100, 0));
    points.push(new THREE.Vector3(100, -100, 0));
    points.push(new THREE.Vector3(100, 0, 0));

    // 转化为凸包的点
    let convexHullPoints = null
    // 通过极点方式
    // convexHullPoints = convexHull(points)
    // 通过极边方式
    convexHullPoints = markEE(points)

    // 获取重心到凸包极点的角度
    getAngles(convexHullPoints)
    convexHullPoints.sort((a, b) => {
      return a.angle - b.angle
    })

    // 增加一个起点,使其成为闭合的多边形
    convexHullPoints.push(convexHullPoints[0])
    this.drawLineToScene(convexHullPoints)
  }

  drawLineToScene(points) {
    var material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var line = new THREE.Line(geometry, material);
    this.stage.scene.add(line);
  }
}
