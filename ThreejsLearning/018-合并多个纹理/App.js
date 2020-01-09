// three.js Custom ShaderMaterial with Multiple Textures

var mesh, renderer, scene, camera, controls;

init();
animate();

function init() {

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // scene
  scene = new THREE.Scene();
  window.scene = scene

  // camera
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(000, 0, 250);
  scene.add(camera)
  // controls
  // controls = new THREE.OrbitControls(camera, renderer.domElement);

  // no lights in this example; fake them in the shader

  // cube geometry
  var geometry = new THREE.BoxGeometry(70, 70, 70);

  // texture
  // let img1 = new Image()
  // img1.src =
  // let img2 = new Image()
  // img2.src = img2b
  let texture = new THREE.TextureLoader().load('./01.png');
  texture.needsUpdate = true; // important
  let texture2 = new THREE.TextureLoader().load('./02.png');
  // var texture = new THREE.Texture(generateTexture());
  // var texture = new THREE.Texture(texture1);
  // var texture2 = new THREE.Texture(generateTexture2()); // texture background is transparent
  // var texture2 = new THREE.Texture(img2); // texture background is transparent
  // texture2.needsUpdate = true; // important

  // uniforms
  var uniforms = {
    color: { type: "c", value: new THREE.Color(0x0000ff) },
    texture: { type: "t", value: texture },
    texture2: { type: "t", value: texture2 }
  };

  // attributes
  var attributes = {
  };

  // material
  var material = new THREE.ShaderMaterial({
    attributes: attributes,
    uniforms: uniforms,
    vertexShader: document.getElementById('vertex_shader').textContent,
    fragmentShader: document.getElementById('fragment_shader').textContent
  });

  // cube
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

}

function animate() {

  requestAnimationFrame(animate);

  // controls.update();

  // mesh.rotation.x += 0.001;
  // mesh.rotation.y += 0.002;
  // mesh.rotation.z += 0.003;

  renderer.render(scene, camera);

}

// Utility
// ---------------------------------------------------------------------------------

function generateTexture2() {

  // draw a circle in the center of the canvas
  var size = 256;

  // create canvas
  var canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  // get context
  var context = canvas.getContext('2d');

  // draw background
  context.fillStyle = "rgba( 0, 0, 0, 1.0 )";
  context.fillRect(0, 0, size, size);

  // draw circle
  var centerX = size / 2;
  var centerY = size / 2;
  var radius = size / 2.8;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = "rgba( 0, 255, 0, 1 )";
  context.fill();
  //context.lineWidth = 10;
  //context.strokeStyle = "red";
  //context.stroke();

  return canvas;

}

function generateTexture() {

  // draw a circle in the center of the canvas
  var size = 256;

  // create canvas
  var canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  // get context
  var context = canvas.getContext('2d');

  // draw background
  context.fillStyle = "rgba( 255, 204, 102, 1 )";
  context.fillRect(0, 0, size, size);

  // draw circle
  var centerX = size / 2;
  var centerY = size / 2;
  var radius = size / 3;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.lineWidth = 10;
  context.strokeStyle = "red";
  context.stroke();

  return canvas;

}
