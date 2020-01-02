const THREE = window.THREE
let isDrawing = false

/**
 * 二维点, 在平面 YOZ
 */
class Point {
  constructor(x, z) {
    this.x = x;
    this.z = z;
  }
}

const pointStart = new Point(0, 0)
const pointEnd = new Point(20, -100)

export class Bresenham {
  constructor(scene) {
    this.scene = scene
  }

  addPoints() {
    //当起始点跟终点相同
    if (pointEnd.z == pointStart.z && pointEnd.x == pointStart.x) {
      return;
    }

    //当斜率为0时
    if (pointStart.z == pointEnd.z) {
      if (pointEnd.x > 0) {
        for (let i = pointStart.x, k = pointStart.z; i < pointEnd.x; i++) {
          let vector = new THREE.Vector3(i, 0, k);
          this.setPoints(vector);
        }
      } else {
        for (let i = pointStart.x, k = pointStart.z; i >= pointEnd.x; i--) {
          let vector = new THREE.Vector3(i, 0, k);
          this.setPoints(vector);
        }
      }
      isDrawing = true;
      return;
    }
    //当斜率为无穷大时
    if (pointEnd.x == pointStart.x) {
      if (pointEnd.z > 0) {
        for (let i = pointStart.z, k = pointStart.x; i >= -pointEnd.z; i--) {
          let vector = new THREE.Vector3(k, 0, i);
          this.setPoints(vector);
        }
      } else {
        for (let i = pointStart.z, k = pointStart.x; i < pointEnd.z; i++) {
          let vector = new THREE.Vector3(k, 0, i);
          this.setPoints(vector);
        }
      }
      isDrawing = true;
      return;
    }
    //计算直线斜率
    let dx = pointEnd.x - pointStart.x, dy = pointEnd.z - pointStart.z;
    let p = 2 * dy - dx;
    let p_1 = 2 * dx - dy;
    let twoDy = 2 * dy, twoDyMinusDx = 2 * (dy - dx), twoDyAddDx = 2 * (dy + dx);
    let twoDx = 2 * dx, twoDxMinusDy = 2 * (dx - dy);
    let gradient = (pointEnd.z - pointStart.z) / (pointEnd.x - pointStart.x);
    let x = pointStart.x;
    let z = pointStart.z;
    //绘制起始点
    this.setPoints(new THREE.Vector3(pointStart.x, 0, pointStart.z));
    //判断斜率绝对值是否小于1
    if (Math.abs(gradient) < 1) {
      //判断斜率是否大于0
      if (gradient > 0) {
        while (x < pointEnd.x) {
          x++;
          if (p > 0) {
            this.setPoints(new THREE.Vector3(x, 0, --z));
            p = p + twoDyMinusDx;
          } else {
            this.setPoints(new THREE.Vector3(x, 0, z));
            p = p + twoDy;
          }
        }
        isDrawing = true;
      } else {
        while (x < pointEnd.x) {
          x++;
          if (p < 0) {
            this.setPoints(new THREE.Vector3(x, 0, ++z));
            p = p + twoDyAddDx;
          } else {
            this.setPoints(new THREE.Vector3(x, 0, z));
            p = p + twoDy;
          }
        }
        isDrawing = true;
      }
    } else {
      if (gradient > 0) {
        while (z > -pointEnd.z) {
          z--;
          if (p_1 >= 0) {
            this.setPoints(new THREE.Vector3(++x, 0, z));
            p_1 = p_1 + twoDxMinusDy;
          } else {
            this.setPoints(new THREE.Vector3(x, 0, z));
            p_1 = p_1 + twoDx;
          }
        }
        isDrawing = true;
      } else {
        while (z < -pointEnd.z) {
          z++;
          if (p_1 > 0) {
            this.setPoints(new THREE.Vector3(++x, 0, z));
            p_1 = p_1 + twoDyAddDx;
          } else {
            this.setPoints(new THREE.Vector3(x, 0, z));
            p_1 = p_1 + twoDx;
          }
        }
        isDrawing = true;
      }
    }
  }

  setPoints(vector) {
    console.error({
      x: vector.x,
      z: vector.z
    });

    let pointsGeometry = new THREE.Geometry();
    pointsGeometry.vertices.push(vector);
    let pointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 1 });
    let points = new THREE.Points(pointsGeometry, pointsMaterial);
    // console.log(points);
    points.name = "point"
    this.scene.add(points);
  }
}
