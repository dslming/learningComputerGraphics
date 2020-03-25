function Area2(p, q, s) {
  let ret = p.x * q.y - p.y * q.x
    + q.x * s.y - q.y * s.x
    + s.x * p.y - s.y * p.x;
  return ret
}

function ToLeft(p, q, s) {
  return Area2(p, q, s) > 0;
}

function isTrangle(p, q, r, s) {
  var pqLeft = ToLeft(p, q, s);
  var qrLeft = ToLeft(q, r, s);
  var rpLeft = ToLeft(r, p, s);
  var ret = (pqLeft && qrLeft && rpLeft)
  return ret;
}

// ---------基于极点凸包检测-------
export function convexHull(points) {
  points.forEach(item => {
    item.extrem = false
  });

  const n = points.length
  for (let p = 0; p < n; p++)
    for (let q = 0; q < n; q++)
      for (let r = 0; r < n; r++)
        for (let s = 0; s < n; s++) {
          if (s == p || s == q || s == r || !points[s].extrem) {
            continue
          }
          if (isTrangle(points[p], points[q], points[r], points[s])) {
            points[s].extrem = false
          }
        }

  let ret = []
  points.forEach((item, i) => {
    if (item.extrem == true) {
      ret.push(item)
    }
  });
  return ret
}

// ---------基于极边的凸包检测------
function checkEdge(points, p, q) {
  const n = points.length

  let leCount = 0
  let reCount = 0

  for (let k = 0; k < n; k++) {
    if (k != p && k != q && q != p) {
      if (ToLeft(points[p], points[q], points[k])) {
        leCount += 1
      } else {
        reCount += 1
      }
    }
  }
  if ((leCount == 0 || reCount == 0) && (leCount != reCount)) {
    points[p].extreme = true;
    points[q].extreme = true
  }
}

export function markEE(points) {
  const n = points.length
  for (let k = 0; k < n; k++) {
    //先假设所有的点都不是极点
    points[k].extreme = false;
  }

  for (let p = 0; p < n; p++)
    for (let q = 0; q < n; q++)
      checkEdge(points, p, q);

  // 将不是极点的移出数组
  let ret = []
  points.forEach((item, i) => {
    if (item.extreme == true) {
      ret.push(item)
    }
  });
  // console.error(ret);
  return ret
}


