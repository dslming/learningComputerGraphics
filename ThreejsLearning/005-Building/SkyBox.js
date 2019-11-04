let THREE = window.THREE

var urls = [
  'https://zultanzul.github.io/ThreeJS-Robot/skybox/sky_pos_x.jpg',
  'https://zultanzul.github.io/ThreeJS-Robot/skybox/sky_neg_x.jpg',
  'https://zultanzul.github.io/ThreeJS-Robot/skybox/sky_pos_y.jpg',
  'https://zultanzul.github.io/ThreeJS-Robot/skybox/sky_neg_y.jpg',
  'https://zultanzul.github.io/ThreeJS-Robot/skybox/sky_neg_z.jpg',
  'https://zultanzul.github.io/ThreeJS-Robot/skybox/sky_pos_z.jpg'
];

class SkyBox {
  constructor() {
    var reflectionCube = new THREE.CubeTextureLoader().load( urls );
    reflectionCube.format = THREE.RGBFormat;
    
    var shader = THREE.ShaderLib["cube"];
    shader.uniforms["tCube"].value = reflectionCube;
    
    var material = new THREE.ShaderMaterial( {	
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide		
    })
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry( 5000, 5000, 5000 ), material );	
  }
}
