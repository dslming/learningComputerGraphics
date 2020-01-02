const THREE = window.THREE
let isDrawing = false

/**
 * 二维点, 在平面 YOZ
 */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const p0 = new Point(0, 0)
const p1 = new Point(20, 100)

export class DDA {
  constructor(scene) {
    this.scene = scene
  }

  addPoints() {
    let dx = p1.x - p0.x
    let dy = p1.y - p0.y
    let k = dy / dx
    let y = p0.y
    let x = 0

    for (x = p0.x; x <= p1.x; x++) {
      let tempPoint
      if (Math.abs(k) > 1) {
        tempPoint = new THREE.Vector3(x, parseInt(y + 0.5), 0)
      } else {
        tempPoint = new THREE.Vector3(parseInt(x + 0.5), y, 0)
      }
      this.setPoints(tempPoint)
      y = y + k
    }
  }

  setPoints(vector) {
    let pointsGeometry = new THREE.Geometry();
    pointsGeometry.vertices.push(vector);
    let pointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 1 });
    let points = new THREE.Points(pointsGeometry, pointsMaterial);
    points.name = "point"
    this.scene.add(points);
  }
}
