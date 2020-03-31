// 算法来自three.js Matrix3.js

export default class MyMatrix3 {
  constructor() { }

  // 求逆矩阵
  getInverse(matrix, throwOnDegenerate) {
    if (matrix && matrix.isMatrix4) {
      console.error("THREE.Matrix3: .getInverse() no longer takes a Matrix4 argument.");
    }

    var me = matrix.elements,
      te = this.elements,

      // 将输入行优先的矩阵进行转置 => 内部使用列优先形式的矩阵
      n11 = me[0], n21 = me[1], n31 = me[2],
      n12 = me[3], n22 = me[4], n32 = me[5],
      n13 = me[6], n23 = me[7], n33 = me[8],

      t11 = n33 * n22 - n32 * n23,
      t12 = n32 * n13 - n33 * n12,
      t13 = n23 * n12 - n22 * n13,

      det = n11 * t11 + n21 * t12 + n31 * t13;

    if (det === 0) {

      var msg = "THREE.Matrix3: .getInverse() can't invert matrix, determinant is 0";

      if (throwOnDegenerate === true) {

        throw new Error(msg);

      } else {

        console.warn(msg);

      }

      return this.identity();

    }

    var detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = (n31 * n23 - n33 * n21) * detInv;
    te[2] = (n32 * n21 - n31 * n22) * detInv;

    te[3] = t12 * detInv;
    te[4] = (n33 * n11 - n31 * n13) * detInv;
    te[5] = (n31 * n12 - n32 * n11) * detInv;

    te[6] = t13 * detInv;
    te[7] = (n21 * n13 - n23 * n11) * detInv;
    te[8] = (n22 * n11 - n21 * n12) * detInv;

    return this;

  }
}
