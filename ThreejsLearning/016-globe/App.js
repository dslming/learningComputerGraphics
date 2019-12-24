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
    this.render = this.render.bind(this);

    this.init()
  }

  static loadTexture(url) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(url, (res) => {
        resolve(res)
      });
    })
  }


  async init() {
    this.container = document.getElementById('container');
    this.camera = new THREE.Camera();
    this.camera.position.z = 1;
    this.scene = new THREE.Scene();
    window.scene = this.scene
    this.scene.add(this.camera)
    const texture = await App.loadTexture("./uv.png")
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const plane = new THREE.PlaneBufferGeometry(2, 2);
    this.uniforms = {
      u_time: { type: "f", value: 0 },
      u_resolution: { type: "v3", value: new THREE.Vector3() },
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      iChannel0: { type: "t", value: texture }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,//document.getElementById('vertexShader').textContent,
      fragmentShader: fragmentShader//document.getElementById('fragmentShader').textContent
    });

    var mesh = new THREE.Mesh(plane, material);
    scene.add(mesh);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.autoClearColor = false;
    this.container.appendChild(this.renderer.domElement);

    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize, false);
    this.animate();
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
    this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    this.uniforms.u_resolution.value.z = 1;
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.render();
  }

  render() {
    // this.uniforms.u_time.value += 0.05;
    this.renderer.render(this.scene, this.camera);
  }
}

new App()

