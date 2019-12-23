export class CarLights {
  constructor(webgl, options, color, speed) {
    this.webgl = webgl;
    this.options = options;
    this.color = color;
    this.speed = speed;
  }
  init() {
    const options = this.options;
    let curve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1)
    );
    let baseGeometry = new THREE.TubeBufferGeometry(curve, 25, 1, 8, false);
    let instanced = new THREE.InstancedBufferGeometry().copy(baseGeometry);
    instanced.maxInstancedCount = options.nPairs * 2;

    let aOffset = [];
    let aMetrics = [];

    let sectionWidth = options.roadWidth / options.roadSections;

    for (let i = 0; i < options.nPairs; i++) {
      let radius = Math.random() * 0.1 + 0.1;
      let length =
        Math.random() * options.length * 0.08 + options.length * 0.02;
      // 1a. Get it's lane index
      // Instead of random, keep lights per lane consistent
      let section = i % 3;

      // 1b. Get its lane's centered position
      let sectionX =
        section * sectionWidth - options.roadWidth / 2 + sectionWidth / 2;
      let carWidth = 0.5 * sectionWidth;
      let offsetX = 0.5 * Math.random();

      let offsetY = radius * 1.3;

      let offsetZ = Math.random() * options.length;

      aOffset.push(sectionX - carWidth / 2 + offsetX);
      aOffset.push(offsetY);
      aOffset.push(-offsetZ);

      aOffset.push(sectionX + carWidth / 2 + offsetX);
      aOffset.push(offsetY);
      aOffset.push(-offsetZ);

      aMetrics.push(radius);
      aMetrics.push(length);

      aMetrics.push(radius);
      aMetrics.push(length);
    }
    // Add the offset to the instanced geometry.
    instanced.addAttribute(
      "aOffset",
      new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false)
    );
    instanced.addAttribute(
      "aMetrics",
      new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false)
    );

    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(this.color)),
        uTravelLength: new THREE.Uniform(options.length),
        uTime: new THREE.Uniform(0),
        uSpeed: new THREE.Uniform(this.speed)
      }
    });
    let mesh = new THREE.Mesh(instanced, material);
    mesh.frustumCulled = false;

    this.mesh = mesh;

    this.webgl.scene.add(mesh);
  }
  update(time) {
    this.mesh.material.uniforms.uTime.value = time;
  }
}

const fragmentShader = `
uniform vec3 uColor;
  void main() {
      vec3 color = vec3(uColor);
      gl_FragColor = vec4(color,1.);
  }
`;

const vertexShader = `
attribute vec3 aOffset;
attribute vec2 aMetrics;
uniform float uTime;
uniform float uSpeed;
uniform float uTravelLength;
  void main() {
    vec3 transformed = position.xyz;

    float radius = aMetrics.r;
    float len = aMetrics.g;
    transformed.xy *= radius;
    transformed.z *= len;

    float zOffset = uTime * uSpeed + aOffset.z;
    zOffset = len - mod(zOffset, uTravelLength);

    // transformed.z +=uTime * uSpeed;


		// Keep them separated to make the next step easier!
	   transformed.z = transformed.z +zOffset ;
        transformed.xy += aOffset.xy;

        vec4 mvPosition = modelViewMatrix * vec4(transformed,1.);
        gl_Position = projectionMatrix * mvPosition;
	}
`;
