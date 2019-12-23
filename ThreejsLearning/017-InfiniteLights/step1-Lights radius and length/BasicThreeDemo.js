export class BasicThreeDemo {
  constructor(container) {
    this.container = container;
    // {
    //   antialias: true
    // }
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(container.offsetWidth, container.offsetHeight, false);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.autoClearColor = false;

    container.append(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    this.camera.name = "camera"
    this.scene = new THREE.Scene();
    this.scene.add(this.camera)
    window.scene = this.scene
    this.clock = new THREE.Clock();
    this.assets = {};
    this.disposed = false;
    this.tick = this.tick.bind(this);
    this.init = this.init.bind(this);
  }
  loadAssets() {
    return new Promise((resolve, reject) => {
      // const manager = new THREE.LoadingManager(resolve);
      // this.text.load(manager);
    });
  }
  init() {
    setInterval(() => {
      this.tick();
    }, 100);
  }

  dispose() {
    this.disposed = true;
  }
  onResize() { }
  update() { }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  tick() {
    // if (this.disposed) return;
    // const delta = this.clock.getDelta();
    this.render();
    // this.update(delta);
  }
}
