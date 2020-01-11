import { _Math } from './lib/Math.js';
import { Matrix4 } from './lib/Matrix4.js';
import { Vector3 } from './lib/Vector3.js'
import { Quaternion } from './lib/Quaternion.js'

/**
 * 投影相机
 * 改编自: https://github.com/mrdoob/three.js/tree/dev/src/cameras 中
 * 的 PerspectiveCamera.js
 */
export class PerspectiveCamera {
  constructor({ fov = 50, aspect = 1, near = 0.1, far = 2000, position }) {
    // 投影矩阵
    this.projectionMatrix = new Matrix4()
    // 世界矩阵
    this.matrixWorld = new Matrix4();
    this.matrixWorldInverse = new Matrix4();

    // 局部坐标矩阵
    this.matrix = new Matrix4();
    this.modelViewMatrix = new Matrix4();
    this.position = new Vector3(position.x, position.y, position.z);
    this.quaternion = new Quaternion();
    this.scale = new Vector3(1, 1, 1);

    let top = near * Math.tan(_Math.DEG2RAD * 0.5 * fov)
    let height = 2 * top
    let width = aspect * height
    let left = - 0.5 * width
    this.projectionMatrix.makePerspective(left, left + width, top, top - height, near, far);

    this.updateMatrix()
  }

  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale);
    this.matrixWorld = this.matrix.clone()
    this.matrixWorldInverse.getInverse(this.matrixWorld);
  }

  getProjectionMatrix() {
    return this.projectionMatrix
  }


  /**
   * 获取目标对象在相机坐标下的转换矩阵
   * @param {*} obj 被相机观察的目标对象
   */
  getModelViewMatrix(obj) {
    if (!obj) {
      return new Matrix4()
    }
    return this.modelViewMatrix.multiplyMatrices(this.matrixWorldInverse, obj.matrixWorld);
  }
}
