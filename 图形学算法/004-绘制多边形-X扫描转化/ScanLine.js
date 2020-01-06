// 新边表节点,存放所有边的信息
class NetNode {
  constructor(obj) {
    let { p1, p2, k, maxY, minY, minX, dx } = obj
    this.p1 = p1
    this.p2 = p2
    this.k = k
    this.maxY = maxY
    this.minY = minY
    this.minX = minX // xmin
    this.dx = dx
  }
}

// 活性表节点
class AetNode {
  constructor(obj) {
    let { x, dx, maxY, next } = obj
    this.x = x
    this.dx = dx
    this.maxY = maxY
    this.next = next
  }
}

function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key]);   //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

// 直线扫描算法
export class ScanLine {
  constructor() {
  }

  /**
   *
   * @param {*} polyPoints 多边形用顶点描述
   */
  polyfill(polyPoints = []) {
    // 存放多边形点阵形式的坐标
    let res = []

    // 获得扫描线的范围
    let maxY = 0;
    let minY = 1 / 0;
    polyPoints.forEach(point => {
      maxY = point.y > maxY ? point.y : maxY;
      minY = point.y < minY ? point.y : minY;
    });

    // 建立新边表 neT, 存放所有边的信息
    const neT = this.getLinesByPoints(polyPoints)
    // console.error(neT);

    // 建立活性边表的第一条数据y=minY 放入 aeT
    let currentY = minY
    let currentIndex = 0;
    let aeT = {
      next: null
    }
    let ae = aeT
    while (neT[currentIndex] && neT[currentIndex].minY == currentY) {
      let { minX, dx, maxY } = neT[currentIndex];
      ae.next = new AetNode({ x: minX, dx, maxY, next: null })
      ae = ae.next;
      currentIndex++;
    }
    console.error("net", deepCopy(neT));
    console.error("aet", deepCopy(aeT));

    // 开始扫描转换, minY ~ maxY
    for (; currentY <= maxY; currentY++) {
      //交点数组
      let activeXs = [];
      let aeLast = aeT;

      do {
        ae = aeLast.next;
        console.error("in-aeLast", currentY, deepCopy(aeLast));
        console.error("in-ae", currentY, deepCopy(ae));

        activeXs.push(ae.x);
        ae.x += ae.dx;
        // console.log('ae',ae.x,ae.dx);
        //结束边
        if (ae.maxY == currentY) {
          aeLast.next = ae.next;
        }
        else {
          aeLast = ae;
        }
        console.error("out-aeLast", currentY, deepCopy(aeLast));
        console.error("out-ae", currentY, deepCopy(ae));
      }
      while (ae.next)


      activeXs = this.xHandler(activeXs);
      for (let i = 0; i < activeXs.length; i += 2) {
        res = res.concat(this.getAllPointsByX(activeXs[i], activeXs[i + 1], currentY));
      }
      while (neT[currentIndex] && neT[currentIndex].minY == currentY) {
        let { minX, dx, maxY } = neT[currentIndex];
        aeLast.next = { x: minX, dx, maxY, next: null };
        aeLast = aeLast.next;
        currentIndex++;
      }
    }

    return res
  }

  /**
    * 将传入的几个点转化为带斜率边
    * @param  {...any} points
    */
  getLinesByPoints(points) {
    let res = [];
    let firstPoint = points.shift();
    let p1 = firstPoint
    let p2
    for (let i in points) {
      p2 = points[i];
      res.push({ p1, p2, k: (p2.y - p1.y) / (p2.x - p1.x) });
      p1 = p2;
    }
    p2 = firstPoint;
    res.push({ p1, p2, k: (p2.y - p1.y) / (p2.x - p1.x) });
    // console.error(res);

    res = this.sortLinesByY(res)
    return res;
  };

  /**
    * 将传入的几个点按照的先y再x的顺序排列
    * @param  {...any} points
    */
  sortLinesByY(lines) {
    lines.forEach(line => {
      var { p1, p2 } = line;
      if (p1.y > p2.y) { let temp = p2; p2 = p1; p1 = temp; }
      line.maxY = p2.y;
      line.minY = p1.y;
      line.minX = p1.x;
      line.dx = 1 / line.k;
    });

    // 数组将按照升序排列
    lines.sort((l1, l2) => {
      return l1.minY - l2.minY;
    });
    return lines;
  };

  xHandler(xs) {
    xs.sort((a, b) => { return a - b; });
    if (xs.length == 1) { xs.push(xs[0]) };
    return xs;
  }

  getAllPointsByX(x1, x2, y) {
    var res = [], x = x1;
    for (; x <= x2; x++) {
      res.push(this.toP([x, y]));
    }

    return res;
  }

  toP(arr) {
    if (!Array.isArray(arr)) {
      let { x, y } = arr;
      return { x, y };
    }
    //对象化  取整数
    return { x: parseInt(arr[0] + 0.5), y: parseInt(arr[1] + 0.5) }
  }
}
