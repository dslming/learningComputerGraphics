const THREE = window.THREE
let isDrawing = false

/**
 * 二维点, 在平面 XOY
 */
export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Midpoint  {
  constructor(scene) {
    this.scene = scene
  }

  addLinePoints(p0 = { x: 0, y: 0 }, p1 = { x: 0, y: 0 }) {
    let dx = p1.x - p0.x
    let dy = p1.y - p0.y
    let k = dy / dx
    let y = p0.y

    for (let x = p0.x; x <= p1.x; x += 1) {
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
    console.error({
      x: vector.x,
      y: vector.y,
    });

    let pointsGeometry = new THREE.Geometry();
    pointsGeometry.vertices.push(vector);
    let pointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 5 });
    let points = new THREE.Points(pointsGeometry, pointsMaterial);
    points.name = "point"
    this.scene.add(points);
  }
}
