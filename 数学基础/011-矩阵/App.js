import * as THREE from './lib/three.module.js'

window.THREE = THREE
class App {
  constructor() {
    /**
     * 矩阵求逆
     * https://www.shuxuele.com/algebra/matrix-inverse-row-operations-gauss-jordan.html
     * https://threejs.org/docs/index.html#api/zh/math/Matrix3
     * A =
     * 3  0   2
     * 2  0  -2
     * 0  1   1
     *
     * A^-1 =
     * 0.2 -0.2 0.2
     * 0.2 0.3 -0.3
     * 0   1    0
     *
     * 在内部，所有的计算都是使用列优先顺序进行的。
     * 然而，由于实际的排序在数学上没有什么不同，
     * 而且大多数人习惯于以行优先顺序考虑矩阵，所以three.js文档以行为主的顺序显示矩阵。
     * 请记住，如果您正在阅读源代码，您必须对这里列出的任何矩阵进行转置 transpose ，以理解计算。
     */

    // A
    let aaa = new THREE.Matrix3()
    aaa.set(3, 0, 2, 2, 0, -2, 0, 1, 1)
    let v1 = aaa.clone()
    let A = aaa.clone()
    console.error("A:", A);

    // A^-1
    let bbb = aaa.getInverse(aaa)
    let v2 = bbb.clone()
    console.error("A^-1:", v2);

    // A*A^-1
    console.error("A*A^-1", v1.multiply(v2));
  }



}

window.onload = () => {
  new App()
}
