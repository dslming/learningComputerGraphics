const THREE = window.THREE
/**
 * 二维点, 在平面 XOY
 */
export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Bresenham {
  constructor(scene) {
    this.scene = scene
  }

  addLinePoints(p0 = { x: 0, y: 0 }, p1 = { x: 0, y: 0 }) {
    let x = p0.x
    let y = p0.y
    let dx = p1.x - p0.x
    let dy = p1.y - p0.y
    let k = dy / dx
    let e = -0.5

    for (let i = 0; i <= dx; i++) {
      this.setPoints({ x, y })
      x += 1
      e += k
      if (e >= 0) {
        y++
        e = e - 1
      }
    }
  }

  setPoints(v) {
    console.error({
      x: v.x,
      y: v.y,
    });
    let vector = new THREE.Vector3(v.x, v.y, 0)
    let pointsGeometry = new THREE.Geometry();
    pointsGeometry.vertices.push(vector);
    let pointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 1 });
    let points = new THREE.Points(pointsGeometry, pointsMaterial);
    points.name = "point"
    this.scene.add(points);
  }
}
