import * as THREE from 'three';
import Earth from './objects/Earth';
import CityPoint from './objects/CityPoint';
import CityLine from './objects/CityLine';
import TrackballControls from 'three-trackballcontrols';

window.addEventListener('load', () => {
  new Main();
});


/**
 * Three.jsを用いた三角関数デモのクラスです。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export class Main {

  /** シーンオブジェクト */
  public scene: THREE.Scene;
  /** カメラオブジェクト */
  public camera: THREE.PerspectiveCamera;
  /** レンダラーオブジェクト */
  public renderer: THREE.WebGLRenderer;
  /** コントローラー **/
  public controller: TrackballControls;
  /** HTML要素 */
  public containerElement: HTMLElement;

  /** 地球 **/
  public earth: Earth;

  /** 日本 **/
  public japan: CityPoint;

  /** 主要都市一覧 **/
  public cities: CityPoint[]    = [];
  public citiesLine: CityLine[] = [];

  /** 主要都市緯度経度一覧 **/
  public citiesPoints: number[][] = [
    [51.2838, 0],   // イギリス
    [39, -116],      // 北京
    [34, 118],     // ロサンゼルス
    [-33, 151],    // シドニー
    [-23, -46],      // サンパウロ
    [1, 103],       // シンガポール
    [90, 0],       // 北極
    [-90, 0],       // 南極
  ];

  /** 人工衛星 **/
  public satellite: CityPoint;


  constructor() {
    this.setup();
  }


  /**
   * セットアップ
   */
  private setup(): void {
    this.containerElement = document.createElement('div');
    document.body.appendChild(this.containerElement);

    // シーン
    this.scene = new THREE.Scene();

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 1, 2000
    );
    this.camera.position.set(-250, 0, -250);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // レンダラー
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.shadowMap.enabled = true;
    this.containerElement.appendChild(this.renderer.domElement);

    // カメラコントローラー
    this.controller             = new TrackballControls(this.camera, this.renderer.domElement);
    this.controller.noPan       = true;
    this.controller.minDistance = 200;
    this.controller.maxDistance = 1000;

    // 環境光
    const ambientLight = new THREE.AmbientLight(0x111111);
    this.scene.add(ambientLight);

    // スポットライト
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-10000, 0, 0);
    spotLight.castShadow = true;//影
    this.scene.add(spotLight);

    // 地球
    this.earth = new Earth();
    this.scene.add(this.earth);

    // 背景
    const geometry2 = new THREE.SphereGeometry(1000, 60, 40);
    geometry2.scale(-1, 1, 1);
    const material2 = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('images/star.jpg')
    });

    const background = new THREE.Mesh(geometry2, material2);
    this.scene.add(background);

    // 日本
    this.japan = new CityPoint(0xFFFF00);
    this.japan.setLatitude(35.658651);
    this.japan.setLongitude(139.742689);
    this.scene.add(this.japan);

    // 主要都市をプロットして線を引く
    this.citiesPoints.forEach(point => {
      // 都市
      const place: CityPoint = new CityPoint(0xFF00FF);
      place.setLatitude(point[0]);
      place.setLongitude(point[1]);
      this.cities.push(place);
      this.scene.add(place);

      // 線を引く
      const line: CityLine = new CityLine(this.japan, place);
      this.citiesLine.push(line);
      this.scene.add(line);
    });

    // 赤道上衛星3
    this.satellite = new CityPoint(0xFF0000);
    this.scene.add(this.satellite);

    // フレーム毎のレンダーを登録
    this.render();
  }


  /**
   * フレーム毎にさせる処理
   */
  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    // 公転させる
    this.satellite.setLongitude(this.satellite.getLongitude() + 1);

    // 地球を更新
    this.earth.update();

    // 日本を更新
    this.japan.update();

    // 主要都市を更新
    this.cities.map((city, index) => {
      city.update();
      this.citiesLine[index].update();
    });

    // 主要都市を更新
    this.citiesLine.map((cityLine, index) => {
      cityLine.update();
    });


    // 人工衛星を更新
    this.satellite.update();

    // カメラコントローラーの更新
    this.controller.update();

    this.renderer.render(this.scene, this.camera);
  }
}
