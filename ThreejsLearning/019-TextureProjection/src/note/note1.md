> [出处](https://tympanus.net/codrops/2020/01/07/playing-with-texture-projection-in-three-js/)

### ThreeJS计算工具

three-utils.js
#### 1、获取任意深度的可见视野
这两个功能将为您提供距PerspectiveCamera给定距离的场景中可见的高度和宽度。

```js
// 获取任意深度的可见视野
// from https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
export function visibleHeightAtZDepth(depth, camera) {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z
  if (depth < cameraOffset) {
    depth -= cameraOffset
  } else {
    depth += cameraOffset
  }

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth)
}

export function visibleWidthAtZDepth(depth, camera) {
  const height = visibleHeightAtZDepth(depth, camera)
  return height * camera.aspect
}
```

#### 2、定位到曲线
```js
// from https://stackoverflow.com/questions/11179327/orient-objects-rotation-to-a-spline-point-tangent-in-three-js
export function alignOnCurve(object, curve, percentage) {
  // set the object position
  const point = curve.getPoint(percentage)
  object.position.copy(point)

  // get the tangent to the curve
  const tangent = curve.getTangent(percentage).normalize()

  // calculate the axis to rotate around
  const up = new THREE.Vector3(0, 1, 0)
  const axis = new THREE.Vector3().crossVectors(up, tangent).normalize()

  // calcluate the angle between the up vector and the tangent
  const radians = Math.acos(up.dot(tangent))

  // set the quaternion
  object.quaternion.setFromAxisAngle(axis, radians)
}
```

#### 3、鼠标X，Y到Three.js世界X，Y，Z
```js
// from https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
export function mouseToCoordinates({ x, y, targetZ = 0, camera, width, height }) {
  const vec = new THREE.Vector3()
  const pos = new THREE.Vector3()
  vec.set((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5)
  vec.unproject(camera)
  vec.sub(camera.position).normalize()
  const distance = (targetZ - camera.position.z) / vec.z
  pos.copy(camera.position).add(vec.multiplyScalar(distance))
  return pos
}
```
<全文结束>
