export class Road {
  constructor(webgl, options) {
    this.webgl = webgl;
    this.options = options;
  }
  init() {
    const options = this.options;
    const geometry = new THREE.PlaneBufferGeometry(
      options.width,
      options.length,
      20,
      200
    );
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(0x101012))
      }
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = -options.length / 2;

    this.webgl.scene.add(mesh);
    console.log(mesh);
  }
}

const fragmentShader = `
    uniform vec3 uColor;
	void main(){
        gl_FragColor = vec4(uColor,1.);
    }
`;
const vertexShader = `
	void main(){
        vec3 transformed = position.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.);
	}
`;
