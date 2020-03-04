import * as THREE from './lib/three.module.js'
const Vector3 = THREE.Vector3

// 三次多项式
class CubicPoly {
  constructor() {
    this.c0 = 0
    this.c1 = 0
    this.c2 = 0
    this.c3 = 0
  }

  /*
   * 计算三次多项式的系数
   * Compute coefficients for a cubic polynomial
   *   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
   * such that
   *   p(0) = x0, p(1) = x1
   *  and
   *   p'(0) = t0, p'(1) = t1.
   */
  init(x0, x1, t0, t1) {
    this.c0 = x0;
    this.c1 = t0;
    this.c2 = - 3 * x0 + 3 * x1 - 2 * t0 - t1;
    this.c3 = 2 * x0 - 2 * x1 + t0 + t1;
  }

  initCatmullRom(x0, x1, x2, x3, tension) {
    this.init(x1, x2, tension * (x2 - x0), tension * (x3 - x1));
  }

  calc(t) {
    var t2 = t * t;
    var t3 = t2 * t;
    return this.c0 + this.c1 * t + this.c2 * t2 + this.c3 * t3;
  }
}

var tmp = new Vector3()
var px = new CubicPoly()
var py = new CubicPoly()
var pz = new CubicPoly()

export default class CatmullRomCurve3 {
  constructor(points, closed, curveType, tension) {
    this.points = points || [];
    this.curveType = 'catmullrom';
    this.tension = tension || 0.5;
    this.vicePoints = []
  }

  /**
   *
   * @param {*} t 差值进度, 0~1
   */
  _getPoint(t) {
    // 所有的控制点
    var points = this.points;
    // 控制点的数量
    var l = points.length;
    // 计算当前的差值点, 0~l-1
    var p = (l - 1) * t;
    // 0~1
    var intPoint = Number.parseInt(p);
    // 0~1
    var weight = p - intPoint;
    // console.error(`p:${p}, intPoint:${intPoint}, weight:${weight}`);

    // 4 points
    var p0, p1, p2, p3;
    if (intPoint > 0) {
      p0 = points[(intPoint - 1) % l];
    } else {
      // extrapolate first point
      tmp.subVectors(points[0], points[1]).add(points[0]);
      p0 = tmp;
    }

    p1 = points[intPoint % l];
    p2 = points[(intPoint + 1) % l];
    if (intPoint + 2 < l) {
      p3 = points[(intPoint + 2) % l];
    } else {
      // extrapolate last point
      tmp.subVectors(points[l - 1], points[l - 2]).add(points[l - 1]);
      p3 = tmp;
    }
    // console.error(`p0:${JSON.stringify(p0)}`);
    // console.error(`p1:${JSON.stringify(p1)}`);
    // console.error(`p2:${JSON.stringify(p2)}`);
    // console.error(`p3:${JSON.stringify(p3)}`);
    this.vicePoints.push(Object.assign({}, p0))
    this.vicePoints.push(Object.assign({}, p1))
    this.vicePoints.push(Object.assign({}, p2))
    this.vicePoints.push(Object.assign({}, p3))
    // console.error(t);


    px.initCatmullRom(p0.x, p1.x, p2.x, p3.x, this.tension);
    py.initCatmullRom(p0.y, p1.y, p2.y, p3.y, this.tension);
    var point = new Vector3();
    point.set(
      px.calc(weight),
      py.calc(weight),
      0
    );
    // console.error(point, weight);
    return point;
  }
  getVicePoints() {
    return this.vicePoints
  }

  getPoints(divisions) {
    if (divisions === undefined) divisions = 5;
    var points = [];
    for (var d = 0; d <= divisions; d++) {
      points.push(this._getPoint(d / divisions));
    }
    // console.error(points);

    return points;
  }
}
