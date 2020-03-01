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

  // 初始化非均匀CatmullRom
  initNonuniformCatmullRom(x0, x1, x2, x3, dt0, dt1, dt2) {
    // compute tangents when parameterized in [t1,t2]
    var t1 = (x1 - x0) / dt0 - (x2 - x0) / (dt0 + dt1) + (x2 - x1) / dt1;
    var t2 = (x2 - x1) / dt1 - (x3 - x1) / (dt1 + dt2) + (x3 - x2) / dt2;
    // rescale tangents for parametrization in [0,1]
    t1 *= dt1;
    t2 *= dt1;
    this.init(x1, x2, t1, t2);
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
    this.type = 'CatmullRomCurve3';
    this.points = points || [];
    this.closed = closed || false;
    this.curveType = curveType || 'centripetal';
    this.tension = tension || 0.5;
  }

  _getPoint(t, optionalTarget) {
    var point = optionalTarget || new Vector3();
    var points = this.points;
    var l = points.length;

    var p = (l - (this.closed ? 0 : 1)) * t;
    var intPoint = Math.floor(p);
    var weight = p - intPoint;

    if (this.closed) {
      intPoint += intPoint > 0 ? 0 : (Math.floor(Math.abs(intPoint) / l) + 1) * l;
    } else if (weight === 0 && intPoint === l - 1) {
      intPoint = l - 2;
      weight = 1;
    }

    var p0, p1, p2, p3; // 4 points
    if (this.closed || intPoint > 0) {
      p0 = points[(intPoint - 1) % l];
    } else {
      // extrapolate first point
      tmp.subVectors(points[0], points[1]).add(points[0]);
      p0 = tmp;
    }

    p1 = points[intPoint % l];
    p2 = points[(intPoint + 1) % l];
    if (this.closed || intPoint + 2 < l) {
      p3 = points[(intPoint + 2) % l];
    } else {
      // extrapolate last point
      tmp.subVectors(points[l - 1], points[l - 2]).add(points[l - 1]);
      p3 = tmp;
    }

    if (this.curveType === 'centripetal' || this.curveType === 'chordal') {
      // init Centripetal / Chordal Catmull-Rom
      var pow = this.curveType === 'chordal' ? 0.5 : 0.25;
      var dt0 = Math.pow(p0.distanceToSquared(p1), pow);
      var dt1 = Math.pow(p1.distanceToSquared(p2), pow);
      var dt2 = Math.pow(p2.distanceToSquared(p3), pow);

      // safety check for repeated points
      if (dt1 < 1e-4) dt1 = 1.0;
      if (dt0 < 1e-4) dt0 = dt1;
      if (dt2 < 1e-4) dt2 = dt1;

      px.initNonuniformCatmullRom(p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2);
      py.initNonuniformCatmullRom(p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2);
      pz.initNonuniformCatmullRom(p0.z, p1.z, p2.z, p3.z, dt0, dt1, dt2);

    } else if (this.curveType === 'catmullrom') {
      px.initCatmullRom(p0.x, p1.x, p2.x, p3.x, this.tension);
      py.initCatmullRom(p0.y, p1.y, p2.y, p3.y, this.tension);
      pz.initCatmullRom(p0.z, p1.z, p2.z, p3.z, this.tension);
    }

    point.set(
      px.calc(weight),
      py.calc(weight),
      pz.calc(weight)
    );
    return point;
  }

  getPoints(divisions) {
    if (divisions === undefined) divisions = 5;
    var points = [];
    for (var d = 0; d <= divisions; d++) {
      points.push(this._getPoint(d / divisions));
    }
    return points;
  }
}
