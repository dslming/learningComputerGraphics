/** 都市緯度経度一覧 **/
const citiesPoints = [
  [39, 116, "齐齐哈尔"],
  [47, 123, "齐齐哈尔"],
  [25, 100, "大理"],
  [30, 104, "成都"],
  [43, 87, "乌鲁木齐"],
  [35, 139, "日本"],
];

class App {
  constructor() {
    this.container = ""
    this.control = null
    this.camera = null
    this.scene = null
    this.renderer = null
    this.uniforms = null
    this.onWindowResize = this.onWindowResize.bind(this);
    this.animate = this.animate.bind(this);

    this.initStage()
    this.addObj()
    this.initControls()

    window.addEventListener('resize', this.onWindowResize, false);
  }

  static loadTexture(url) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(url, (res) => {
        resolve(res)
      });
    })
  }

  async addObj() {
    // 地球
    const texture = new THREE.TextureLoader().load('./ground.jpg');
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(100, 40, 40),
      new THREE.MeshBasicMaterial({ map: texture }));
    earth.name = "earth"
    this.scene.add(earth)

    const beijing = this.createPoint(0xff0000, 39, 116);
    // 绘制清单点
    for (let i = 0; i < citiesPoints.length; i++) {
      const latitude = citiesPoints[i][0];
      const longitude = citiesPoints[i][1];
      let color = i === 0 ? 0xff0000 : 0x00FF00
      const point = this.createPoint(color, latitude, longitude);
      point.name = `point-${citiesPoints[i][2]}`
      this.scene.add(point);
      const line = this.createLine(beijing.position, point.position);
      line.name = "line"
      scene.add(line);
    }

    // 开始渲染
    this.onWindowResize();
    this.animate();
  }

  /**
 * 生成要绘制的点
 * @param {number} color
 * @param {number} latitude
 * @param {number} longitude
 * @returns {THREE.Mesh} 球
 */
  createPoint(color, latitude = 0, longitude = 0) {
    // 球
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(2),
      new THREE.MeshBasicMaterial({ color: color }));
    // 从经纬度设定位置
    sphere.position.copy(this.translateGeoCoords(latitude, longitude, 100));
    return sphere;
  }


  /**
   * 根据经度和纬度计算位置。
   * @param {number} latitude 纬度
   * @param {number} longitude 经度
   * @param {number} radius 半径
   * @returns {Vector3} 3D坐标。
   * @see https://ics.media/entry/10657
   */
  translateGeoCoords(latitude, longitude, radius) {
    // 仰角
    const phi = (latitude) * Math.PI / 180;
    // 方位角
    const theta = (longitude - 180) * Math.PI / 180;
    const x = -(radius) * Math.cos(phi) * Math.cos(theta);
    const y = (radius) * Math.sin(phi);
    const z = (radius) * Math.cos(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  }

  /**
 * 生成连接两个点的线
 * @param {THREE.Vector3} startPoint 開始点
 * @param {THREE.Vector3} endPoint 終了点
 * @returns {THREE.Line} 線
 * @see https://ics.media/entry/10657
 */
  createLine(startPoint, endPoint) {
    // 線
    const geometry = new THREE.Geometry();
    geometry.vertices = this.getOrbitPoints(startPoint, endPoint, 15);
    return new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ linewidth: 5, color: 0x00ffff }));
  }

  /**
   * 以数组形式返回轨道坐标。
   * @param {Vector3} startPos 開始点です。
   * @param {Vector3} endPos 終了点です。
   * @param {number} segmentNum セグメント分割数です。
   * @returns {Vector3[]} 軌跡座標の配列です。
   * @see https://ics.media/entry/10657
   */
  getOrbitPoints(startPos, endPos, segmentNum) {
    // 包含顶点的数组
    const vertices = [];
    const startVec = startPos.clone();
    const endVec = endPos.clone();

    // 两个向量的旋转轴
    const axis = startVec.clone().cross(endVec);
    // 轴向量到单位向量
    axis.normalize();
    // 由两个向量交织的角度
    const angle = startVec.angleTo(endVec);

    // 击中顶点以绘制连接两个点的弧
    for (let i = 0; i < segmentNum; i++) {
      // 围绕轴生成四元数
      const q = new THREE.Quaternion();
      q.setFromAxisAngle(axis, angle / segmentNum * i);
      // 旋转向量
      const vertex = startVec.clone().applyQuaternion(q);
      vertices.push(vertex);
    }

    // 添加终点
    vertices.push(endVec);
    return vertices;
  }



  initStage() {
    // 相机
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.set(-250, 0, -250);
    this.camera.name = "camera"

    // 场景
    this.scene = new THREE.Scene();
    window.scene = this.scene
    this.scene.add(this.camera)

    // 渲染器
    this.container = document.getElementById('container');
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.autoClearColor = false;
    this.container.appendChild(this.renderer.domElement);
  }

  initControls() {
    let control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.control = control
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    control.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    control.dampingFactor = 0.35;
    //是否可以缩放
    control.enableZoom = true;
    control.zoomSpeed = 0.35;
    //是否自动旋转
    control.autoRotate = false;
    //是否开启右键拖拽
    control.enablePan = false;
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
    this.control && this.control.update()
  }
}

new App()

