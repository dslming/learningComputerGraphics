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

export class MidpointLine {
  constructor(scene) {
    this.scene = scene
  }

  addLinePoints(p0 = { x: 0, y: 0 }, p1 = { x: 0, y: 0 }) {
    let a = p0.y - p1.y
    let b = p1.x - p0.x

    let x = p0.x
    let y = p0.y
    this.setPoints({
      x,
      y
    })

    // 斜率绝对值 <= 1
    if (-a <= b) {
      let d = 2 * a + b;
      let d1 = 2 * a;
      let d2 = 2 * (a + b);
      while (x < p1.x) {
        x++
        if (d < 0) {
          y++
          d += d2
        } else {
          d += d1
        }
        this.setPoints({
          x,
          y
        })
      }
    }
    // 斜率绝对值 > 1
    else {
      let d = 2 * b + a;
      let d1 = 2 * b;
      let d2 = 2 * (a + b);
      while (y < p1.y) {
        y++
        if (d < 0) {
          d += d1
        } else {
          x++
          d += d2
        }
        this.setPoints({
          x,
          y
        })
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
