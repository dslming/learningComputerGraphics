import { fragmentShader } from './glsl.fragmentShader.js'
import { vertexShader } from './glsl.vertexShader.js'

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
    // 几何体
    const geometry = new THREE.SphereBufferGeometry(30, 64, 64);
    this.uniforms = {
      iTime: { type: "f", value: 0 },
      iResolution: { type: "v3", value: new THREE.Vector3() },
    };

    // 材质
    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // 网格
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = "spare"
    this.scene.add(mesh);

    // 开始渲染
    this.onWindowResize();
    this.animate();
  }

  initStage() {
    // 相机
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.z = 100;
    this.camera.position.y = 100;
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
    //设置相机距离原点的最远距离
    // control.minDistance = 22; //1000
    //设置相机距离原点的最远距离
    // control.maxDistance = 50; //3000
    //是否开启右键拖拽
    control.enablePan = false;
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.uniforms.iResolution.value.x = this.renderer.domElement.width;
    this.uniforms.iResolution.value.y = this.renderer.domElement.height;
    this.uniforms.iResolution.value.z = 1;
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.camera.lookAt(this.scene.position)
    this.renderer.render(this.scene, this.camera);
    this.control && this.control.update()
  }
}

new App()

