// 计算向量的夹角,角度 0~360
export function angle_360(v1, v2) {
  let p1 = v1.clone()
  let p2 = v2.clone()

  // 弧度转角度
  let theta = THREE.Math.radToDeg(p1.angleTo(p2))
  let p3 = p1.cross(p2);
  if (p3.z > 0)
    return theta
  else
    return 360 - theta
}

// 获取多边形的重心
export function getGravityCenter(points) {
  let x = 0
  let y = 0
  let z = 0
  const n = points.length | 1
  points.forEach(item => {
    x += item.x
    y += item.y
    z += item.z
  });
  return { x: x / n, y: y / n, z: z / n }
}
