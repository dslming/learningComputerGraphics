import { fragmentShader } from './fragmentShader.glsl.js'
import { vertexShader } from './vertexShader.glsl.js'

class App {
  constructor() {
    this.container = ""
    this.camera = null
    this.scene = null
    this.renderer = null
    this.uniforms = null
    this.onWindowResize = this.onWindowResize.bind(this);
    this.animate = this.animate.bind(this);

    this.initStage()
    this.addCameraHelper()
    this.addObj()

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
    // 纹理
    const texture = await App.loadTexture("./uv.png")
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // 几何体
    const plane = new THREE.BoxGeometry(0, 0, 0);
    this.uniforms = {
      u_time: { type: "f", value: 0 },
      u_resolution: { type: "v3", value: new THREE.Vector3() },
      iChannel0: { type: "t", value: texture }
    };

    // 材质
    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    // 网格
    var mesh = new THREE.Mesh(plane, material);
    mesh.name = "spare"
    this.scene.add(mesh);

    // 开始渲染
    this.onWindowResize();
    this.animate();
  }

  initStage() {
    // 相机
    this.camera = new THREE.Camera();
    this.camera.position.z = 1;

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

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
    this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    this.uniforms.u_resolution.value.z = 1;
  }

  animate() {
    requestAnimationFrame(this.animate);
    // this.uniforms.u_time.value += 0.05;
    this.renderer.render(this.scene, this.camera);
    this.cameraHelper && this.cameraHelper.update()
  }

  addCameraHelper() {
    this.cameraHelper = new THREE.CameraHelper(this.camera)
    this.scene.add(this.cameraHelper)
  }
}

new App()

