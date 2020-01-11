import * as THREE from 'three'
import createOrbitControls from 'orbit-controls'

let that = null;
let i = 0
export class Stage {
  constructor(container) {
    this.fuArr = []
    this.viceCamera = null
    this.tmpTarget = new THREE.Vector3()
    this.orbitControls = null
    this.cameraHelper = null
    this.container = container;
    this.initFlag = false;
    that = this;
    // 场景
    this.scene = new THREE.Scene();
    this.scene.name = "moumade";
    window.scene = this.scene;

    // 环境光
    var ambient = new THREE.AmbientLight(0xffffff, 1);
    ambient.name = "ambient";
    this.scene.add(ambient);

    // 渲染器
    this.containerEle = document.querySelector(container);
    let vW = this.containerEle.clientWidth;
    let vH = this.containerEle.clientHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      // enabled for saving screenshots of the canvas,
      // may wish to disable this for perf reasons
      preserveDrawingBuffer: true,
      failIfMajorPerformanceCaveat: true,
    });
    this.renderer.setClearColor(0x000000, 0.0);
    this.renderer.autoClear = false;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(vW, vH, false);
    this.containerEle.appendChild(this.renderer.domElement);
    // 相机
    // this.camera = new THREE.PerspectiveCamera(45, this.containerEle.clientWidth / this.containerEle.clientHeight, 10, 2000);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000)
    // this.camera.position.set(-1, 1.2, 1)
    this.camera.position.set(-1, 1.2, 5)
    this.camera.lookAt(0, 0, 0)

    this.camera.name = "camera";
    // this.camera.position.set(0, 7, -5)
    // this.camera.rotation.set(0, 0, 0)
    // this.scene.add(this.camera);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  initOrbitControls(options) {
    this.orbitControls = createOrbitControls({
      element: this.canvas,
      parent: window,
      distance: 4,
      ...(options instanceof Object ? options : {}),
    })
  }

  handleResize() {
    // 获取新的大小
    let vpW = that.containerEle.clientWidth;
    let vpH = that.containerEle.clientHeight;
    // 设置场景
    that.renderer.domElement.width = vpW;
    that.renderer.domElement.height = vpH;
    that.renderer.setSize(that.containerEle.clientWidth, that.containerEle.clientHeight);
    // 设置相机
    that.camera.aspect = vpW / vpH;
    that.camera.updateProjectionMatrix();
  }


  run() {
    this._loop()
  }
  addViceCamera(viceCamera) {
    this.viceCamera = viceCamera
  }
  onUpdate(fu) {
    this.fuArr.push(fu)
  }
  _loop() {
    if (that.orbitControls) {
      that.orbitControls.update()
      that.camera.up.fromArray(that.orbitControls.up)
      that.camera.position.fromArray(that.orbitControls.position)
      that.tmpTarget.fromArray(that.orbitControls.target)
      that.camera.lookAt(that.tmpTarget)
    }
    that.camera.updateProjectionMatrix();
    that.camera.updateMatrixWorld()

    var w = window.innerWidth, h = window.innerHeight;
    let mapHeight = 100
    let mapWidth = 100


    that.renderer.clear();
    that.renderer.setViewport(0, 0, w, h);
    that.renderer.render(that.scene, that.camera);
    that.renderer.setViewport(10, h - mapHeight - 10, mapWidth, mapHeight);
    that.renderer.render(that.scene, that.viceCamera);

    // that.renderer.render(that.scene, that.camera);


    that.fuArr.forEach(fun => {
      fun()
    });
    requestAnimationFrame(that._loop)

  }

}

