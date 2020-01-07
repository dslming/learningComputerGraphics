export class CohenSutherland {
  constructor({ xMin, xMax, yMin, yMax }) {
    this.xMin = xMin
    this.xMax = xMax
    this.yMin = yMin
    this.yMax = yMax
  }
  cohenSutherland(p1, p2) {
    let x1_coord = 0
    let y1_coord = 0
    let x2_coord = 0
    let y2_coord = 0

    //初始化区域码
    let code1 = this.initPositionCode(p1)
    let code2 = this.initPositionCode(p2);

    // 1) 简弃
    if (this.isForgo(code1, code2)) {
      this.drawLine(p1, p2, "out");
      return
    }

    // 2)简取, code1 || code2 = 0
    if (code1.every(i => { return i == 0 })) {
      x1_coord = p1.x
      y1_coord = p1.y
    }
    if (code2.every(i => { return i == 0 })) {
      x2_coord = p2.x
      y2_coord = p2.y
    }

    if (code1.find(i => { return i == 1 })) {
      let index = code1.findIndex(i => { return i == 1 })
      let k = (p1.y - p2.y) / (p1.x - p2.x);

      switch (index) {
        case 0:
          // top
          x1_coord = (this.yMax - p2.y) / k + p2.x
          y1_coord = this.yMax
          break;
        case 1:
          // bottom
          x1_coord = (this.yMin - p2.y) / k + p2.x
          y1_coord = this.yMin
          break
        case 2:
          // right
          x1_coord = this.xMax
          y1_coord = (this.xMax - p1.x) * k + p1.y
          break
        case 3:
          // left
          x1_coord = this.xMin
          y1_coord = (this.xMin - p1.x) * k + p1.y
          break
      }
    }

    if (code2.find(i => { return i == 1 })) {
      let index = code2.findIndex(i => { return i == 1 })
      let k = (p1.y - p2.y) / (p1.x - p2.x);
      switch (index) {
        case 0:
          // top
          x2_coord = (this.yMax - p2.y) / k + p2.x
          y2_coord = this.yMax
          break
        case 1:
          // bottom
          x2_coord = (this.yMin - p2.y) / k + p2.x
          y2_coord = this.yMin
          break
        case 2:
          // right
          x2_coord = this.xMax
          y2_coord = (this.xMax - p1.x) * k + p1.y
          break
        case 3:
          // left
          x2_coord = this.xMin
          y2_coord = (this.xMin - p1.x) * k + p1.y
          break
      }
    }
    return {
      p1: {
        x: x1_coord,
        y: y1_coord,
      },
      p2: {
        x: x2_coord,
        y: y2_coord,
      }
    }
  }

  isForgo(code1, code2) {
    let ret = false
    for (let i = 0; i < 4; i++) {
      if (code1[i] * code2[i] != 0) {
        ret = true
      }
    }
    return ret
  }

  //画线
  drawLine(startPoint, endPoint, lineType = 'in') {
    let geometry = new THREE.Geometry();/* 简单基础几何 */
    let lineMaterial;	//线材质
    if (lineType == 'out') {
      lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    } else {
      lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    }
    geometry.vertices.push(startPoint);
    geometry.vertices.push(endPoint);
    let newLine = new THREE.Line(geometry, lineMaterial);
    scene.add(newLine);
  }

  //初始化区域码
  initPositionCode(aPoint) {
    // tbrl
    let positionCode = [];

    // positionCode[0] = top
    if (aPoint.y > this.yMax) {
      positionCode.push(1);
    } else {
      positionCode.push(0);
    }

    // positionCode[1] = bottom
    if (aPoint.y < this.yMin) {
      positionCode.push(1);
    } else {
      positionCode.push(0);
    }

    // positionCode[2] = right
    if (aPoint.x > this.xMax) {
      positionCode.push(1);
    } else {
      positionCode.push(0);
    }

    // positionCode[3] = left
    if (aPoint.x < this.xMin) {
      positionCode.push(1);
    } else {
      positionCode.push(0);
    }

    return positionCode;
  }

}
