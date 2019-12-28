import * as THREE from 'three';

/**
 * 地球の緯度経度などの計算に利用するユーティリティクラスです。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export default class GeoUtil {

  /**
   * @private
   */
  constructor() {
    throw new Error();
  }

  /**
   * 緯度経度から位置を算出します。
   * @param {number} latitude 緯度です。
   * @param {number} longitude 経度です。
   * @param {number} radius 半径です。
   * @returns {Vector3} 3Dの座標です。
   */
  static translateGeoCoords(latitude: number,
                            longitude: number,
                            radius: number): THREE.Vector3 {
    // 仰角
    const phi   = (latitude) * Math.PI / 180;
    // 方位角
    const theta = (longitude - 180) * Math.PI / 180;

    const x = -(radius) * Math.cos(phi) * Math.cos(theta);
    const y = (radius) * Math.sin(phi);
    const z = (radius) * Math.cos(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  }

  /**
   * 軌道の座標を配列で返します。
   * @param {Vector3} startPos 開始点です。
   * @param {Vector3} endPos 終了点です。
   * @param {number} segmentNum セグメント分割数です。
   * @returns {Vector3[]} 3Dの座標の配列です。
   */
  static getOrbitPoints(startPos: THREE.Vector3,
                        endPos: THREE.Vector3,
                        segmentNum: number = 100): THREE.Vector3[] {

    // 頂点を格納する配列
    const vertices: THREE.Vector3[] = [];

    const startVec = startPos.clone();
    const endVec  = endPos.clone();

    // ２つのベクトルの回転軸
    const axis = startVec.clone().cross(endVec);
    axis.normalize();

    // ２つのベクトルが織りなす角度
    const angle = startVec.angleTo(endVec);

    // ２つの衛星を結ぶ弧を描くための頂点を打つ
    for (let i = 0; i < segmentNum; i++) {
      // axisを軸としたクォータニオンを生成
      const q = new THREE.Quaternion();
      q.setFromAxisAngle(axis, angle / segmentNum * i);
      // ベクトルを回転させる
      vertices.push(startVec.clone().applyQuaternion(q));
    }

    // 終了点を追加
    vertices.push(endVec);

    return vertices;
  }
}