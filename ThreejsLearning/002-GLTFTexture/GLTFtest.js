let that = null
class GLTFtest {
  constructor(container) {
    that = this
    this.objects = []

    // render
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( this.renderer.domElement );

    // scene
    this.scene = new THREE.Scene();
    window.scene = this.scene

    // camara
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.name = 'camera'
    this.camera.position.set(0,0,3)
    this.scene.add(this.camera);

    // light
    let light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    this.scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set(0.5, 0, 0.866);
    this.scene.add( light );

    // 3D object
    var loader = new THREE.GLTFLoader().setPath( 'models/' );
    loader.load('Duck.gltf', gltf => {
      console.error(gltf, 'loading over...')
      this.scene.add( gltf.scene );
    },v=>{
      console.error(v)
    },e=>{
      console.error(e)
    })
    this.initControl()
    // run
    this.run()
  }

  initControl() {
    this.control = new THREE.OrbitControls(this.camera, this.container)
    this.control.autoRotate = false
    this.control.enabled = true
  }
  
  run() {
    that.renderer.render(that.scene, that.camera)
    requestAnimationFrame(that.run)
  }
}