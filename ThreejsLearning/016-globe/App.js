import { fragmentShader } from './fragmentShader.glsl.js'
import { vertexShader } from './vertexShader.glsl.js'

var container;
var camera, scene, renderer;
var uniforms;

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(url, (res) => {
      resolve(res)
    });
  })
}

async function init() {
  container = document.getElementById('container');
  camera = new THREE.Camera();
  camera.position.z = 1;
  scene = new THREE.Scene();
  window.scene = scene
  scene.add(camera)
  const texture = await loadTexture("./uv.png")
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const plane = new THREE.PlaneBufferGeometry(2, 2);
  uniforms = {
    u_time: { type: "f", value: 0 },
    u_resolution: { type: "v3", value: new THREE.Vector3() },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    iChannel0: { type: "t", value: texture }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,//document.getElementById('vertexShader').textContent,
    fragmentShader: fragmentShader//document.getElementById('fragmentShader').textContent
  });

  var mesh = new THREE.Mesh(plane, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.autoClearColor = false;
  container.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  document.onmousemove = function (e) {
    uniforms.u_mouse.value.x = e.pageX
    uniforms.u_mouse.value.y = e.pageY
  }
  animate();
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
  uniforms.u_resolution.value.z = 1;
  // console.error(uniforms.u_resolution)
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  // uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}


init();
