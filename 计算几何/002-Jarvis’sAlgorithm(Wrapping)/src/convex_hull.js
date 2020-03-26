/**
 * 测试3个点的连接方向
 * @param {*} p
 * @param {*} q
 * @param {*} r
 * return 0:共线; 1:顺时针; 2:逆时针
 */
function orientation(p, q, r) {
  console.error(p, q, r);

  let v = (
    (q.y - p.y) * (r.x - q.x) -
    (q.x - p.x) * (r.y - q.y)
  );
  if (v == 0) {
    return 0; // colinear
  } else {
    return (v > 0 ? 1 : 2); // CW or CCW
  }
}

export function convexHull(points) {
  // number of points
  let n = points.length;

  // at least three points are needed
  if (n < 3) {
    return;
  }

  // 找到最左边的点,假设这是第一点
  let l = 0;
  for (let i = 0; i < points.length; i++) {
    if (points[i].x < points[l].x) {
      l = i;
    }
  }

  // 从最左边的点开始，继续逆时针移动，直到再次到达起点。
  let p = l;
  let q;
  let hull = [];

  do {
    hull.push(points[p]);
    // 搜索点“ q”，使所有点“ x”的方向（p，x，q）沿逆时针方向。
    // 想法是跟踪q中最后访问的最逆时针点。
    // 如果任何点“ i”都比q逆时针旋转，则更新q。
    q = (p + 1) % n;
    for (let i = 0; i < n; i++) {
      if (orientation(points[p], points[i], points[q]) == 2) {
        q = i;
      }
    }
    console.error(123, points[q]);

    // 现在q是相对于p的最逆时针方向
    p = q;
  } while (p != l);

  console.error(hull);
  return hull;
}
