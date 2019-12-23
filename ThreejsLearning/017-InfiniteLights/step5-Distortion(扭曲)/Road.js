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
      uniforms: Object.assign(
        {
          uColor: new THREE.Uniform(new THREE.Color(0x101012)),
          uTime: new THREE.Uniform(0),
          uTravelLength: new THREE.Uniform(options.length)
        },
        options.distortion.uniforms
      )
    });
    console.log(material.uniforms);
    material.onBeforeCompile = shader => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        options.distortion.getDistortion
      );
    };
    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = -options.length / 2;

    this.webgl.scene.add(mesh);
    this.mesh = mesh;
  }
  update(time) {
    this.mesh.material.uniforms.uTime.value = time;
  }
}

const fragmentShader = `
    uniform vec3 uColor;
	void main(){
        gl_FragColor = vec4(uColor,1.);
    }
`;
const vertexShader = `
uniform float uTravelLength;
#include <getDistortion_vertex>
	void main(){
        vec3 transformed = position.xyz;

    float progress = (transformed.y + uTravelLength / 2.) / uTravelLength;
    vec3 distortion  = getDistortion(progress);
    transformed.x += distortion.x;
    transformed.z += distortion.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed.xyz, 1.);
	}
`;
