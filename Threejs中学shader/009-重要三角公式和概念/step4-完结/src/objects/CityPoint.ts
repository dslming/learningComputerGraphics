import * as THREE from 'three';
import GeoUtil from '../utils/GeoUtil';

/**
 * 都市の3Dポイントの表示クラスです。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export default class CityPoint extends THREE.Group {

  /** 地球からポイントまでの距離 */
  private _radius: number = 110;

  /** 球 */
  public sphere: THREE.Mesh;

  /** 点光源 */
  public pointLight: THREE.PointLight;

  /** 地球からポイントまでの距離を取得 */
  public getRadius(): number {
    return this._radius;
  }

  /** 緯度 */
  private _latitude: number = 0;

  /**
   * 緯度を取得
   */
  public getLatitude(): number {
    return this._latitude;
  }

  /**
   * 緯度を設定
   * @param {number} latitude 緯度
   */
  public setLatitude(latitube: number) {
    this._latitude = latitube;
  }


  /** 経度 */
  private _longitude: number = 0;

  /**
   * 経度を取得
   */
  public getLongitude(): number {
    return this._longitude;
  }

  /**
   * 経度を設定
   * @param {number} longitude 経度
   */
  public setLongitude(longitude: number) {
    this._longitude = longitude;
  }


  /**
   * コンストラクタ
   * @param color ポイントの色
   */
  constructor(color: number) {
    super();

    // 球
    const geometry2 = new THREE.SphereGeometry(2, 35, 35);
    const material2 = new THREE.MeshLambertMaterial({color: color});

    this.sphere               = new THREE.Mesh(geometry2, material2);
    this.sphere.receiveShadow = true;
    this.add(this.sphere);

    // 点光源
    this.pointLight = new THREE.PointLight(color, 2, 0);
    this.add(this.pointLight);
  }

  /**
   * 更新
   */
  public update() {
    const position: THREE.Vector3 = GeoUtil.translateGeoCoords(this._latitude, this._longitude, this._radius);
    this.position.copy(position);
  }
}
