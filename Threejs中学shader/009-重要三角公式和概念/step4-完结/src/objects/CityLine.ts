import * as THREE from 'three';
import CityPoint from './CityPoint';
import GeoUtil from '../utils/GeoUtil';

/**
 * ポイントを結ぶ線分の表示クラスです。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export default class CityLine extends THREE.Group {

  /** 線 **/
  private _line: THREE.Line;

  private _geometry: THREE.Geometry;

  /**
   * コンストラクタ
   * @param {CityPoint} _startTarget 始点となる衛星
   * @param {CityPoint} _endTarget 終点となる衛星
   */
  constructor(private _startTarget, private _endTarget) {
    super();

    this._geometry = new THREE.Geometry();

    this._line = new THREE.Line(
        this._geometry,
        new THREE.LineBasicMaterial({
          linewidth  : 2,
          color      : 0x00FFFF,
          transparent: true,
          opacity    : 0.5
        }));
    this.add(this._line);
  }

  /**
   * 更新
   */
  public update() {
    // 頂点を更新することをフレーム毎に伝える
    this._geometry.verticesNeedUpdate = true;

    this._geometry.vertices = GeoUtil.getOrbitPoints(
        this._startTarget.position,
        this._endTarget.position);
  }
}