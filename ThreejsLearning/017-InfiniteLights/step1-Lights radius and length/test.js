let that = null;
const fragmentShader = `
uniform vec3 uColor;
  void main() {
      vec3 color = vec3(uColor);
      gl_FragColor = vec4(color,1.);
  }
`;

const vertexShader = `
attribute vec3 aOffset;
  void main() {
    vec3 transformed = position.xyz;
		// Keep them separated to make the next step easier!
	   transformed.z = transformed.z + aOffset.z;
        transformed.xy += aOffset.xy;

        vec4 mvPosition = modelViewMatrix * vec4(transformed,1.);
        gl_Position = projectionMatrix * mvPosition;
	}
`;

export class Stage {
  constructor(container) {
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
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x000000, 0.0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(vW, vH, false);
    this.containerEle.appendChild(this.renderer.domElement);
    // 相机
    this.camera = new THREE.PerspectiveCamera(45, this.containerEle.clientWidth / this.containerEle.clientHeight, 10, 2000);
    this.camera.name = "camera";
    this.camera.position.set(0, 7, -5)
    this.camera.rotation.set(0, 0, 0)
    this.scene.add(this.camera);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
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
    setInterval(v => {
      that.renderer.render(that.scene, that.camera);
      // that.control.update()
    }, 200)
  }

  addObjRoad(o) {
    const options = o
    const geometry = new THREE.PlaneBufferGeometry(
      options.width,
      options.length,
      10,
      500
    );

    var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = -options.length / 2;
    mesh.name = "road"
    this.scene.add(mesh);
    console.log(mesh);
  }


  addObjLights(o) {
    const options = o

    // 三维线段曲线
    let curve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    );

    // 管道缓冲几何体 (path, tubularSegments, radius, radialSegments, closed)
    let baseGeometry = new THREE.TubeBufferGeometry(curve, 25, 1, 8, true);

    // 创建一个instancedBufferGeometry
    let instanced = new THREE.InstancedBufferGeometry().copy(baseGeometry);
    instanced.maxInstancedCount = options.nPairs * 2;

    let aOffset = [];
    // 每个车道的宽度 3
    let sectionWidth = options.roadWidth / options.roadSections;

    for (let i = 0; i < options.nPairs; i++) {
      // 1a. 获取车道索引,保持每个车道的灯光一致,而不是随机照明
      let section = i % 3; // 0,1,2

      // 1b. 获取车道的中心位置 -3,0,3
      let sectionX =
        section * sectionWidth - options.roadWidth / 2 + sectionWidth / 2;

      // 车宽是路宽的一半
      let carWidth = 0.5 * sectionWidth;

      // 生成 0～0.5的随机数
      let offsetX = 0.5 * Math.random();
      let offsetY = 1.3;
      let offsetZ = Math.random() * options.length;

      aOffset.push(sectionX - carWidth / 2 + offsetX);
      aOffset.push(offsetY);
      aOffset.push(-offsetZ);

      aOffset.push(sectionX + carWidth / 2 + offsetX);
      aOffset.push(offsetY);
      aOffset.push(-offsetZ);
    }


    // Add the offset to the instanced geometry.
    instanced.addAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false)
    );

    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uColor: new THREE.Uniform(new THREE.Color("0xfafafa"))
      }
    });
    let mesh = new THREE.Mesh(instanced, material);
    mesh.frustumCulled = false;
    mesh.name = "carLights"
    this.scene.add(mesh);
  }
}

const options = {
  length: 200,
  width: 20,
  // 车道总宽 9
  roadWidth: 9,
  islandWidth: 2,
  // 圆环的对儿数
  nPairs: 20,
  // 一共3个车道
  roadSections: 3
};

let a = new Stage("#app")
a.addObjRoad(options)
a.addObjLights(options)
a.run()
