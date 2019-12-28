import * as THREE from 'three';

/**
 * 地球の表示クラスです。
 *
 * @author ICS
 * @see https://ics.media/entry/10657
 */
export default class Earth extends THREE.Group {

  /** 球 **/
  public ground: THREE.Mesh;
  /** 雲 **/
  public cloud: THREE.Mesh;

  /**
   * コンストラクタ
   */
  constructor() {
    super();

    {
      // 地球の球体
      const geometry = new THREE.SphereGeometry(100, 60, 60);
      const material = new THREE.MeshPhongMaterial({
        map        : new THREE.TextureLoader().load('images/ground.jpg'),
        bumpMap    : new THREE.TextureLoader().load('images/bump.jpg'),
        bumpScale  : 1.0,
        specularMap: new THREE.TextureLoader().load('images/specular.png')
      });

      this.ground               = new THREE.Mesh(geometry, material);
      this.ground.receiveShadow = true;
      this.add(this.ground);
    }


    {
      // 雲
      const geometry = new THREE.SphereGeometry(102, 60, 60);
      const material = new THREE.MeshPhongMaterial({
        map        : new THREE.TextureLoader().load('images/cloud.jpg'),
        transparent: true,
        blending   : THREE.AdditiveBlending
      });

      this.cloud            = new THREE.Mesh(geometry, material);
      this.cloud.castShadow = true;
      this.add(this.cloud);
    }

  }

  /**
   * 更新
   */
  public update() {
    this.cloud.rotation.y += 0.0005;
  }
}
