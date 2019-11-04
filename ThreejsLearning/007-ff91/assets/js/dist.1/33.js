var vShader = require('./20');
var fShader = require('./19');
var Floor = function () {
  function Floor(_scene, _pos, _cargo) {
    this.scene = _scene;
    this.pos = _pos;
    this.led = _cargo.getTexture('led');
    this.led.minFilter = THREE.LinearFilter;
    this.led.format = THREE.AlphaFormat;
    var planeGeom = new THREE.PlaneGeometry(10, 10, 30, 30);
    var planeMat = new THREE.RawShaderMaterial({
      uniforms: {
        led: { value: this.led },
        origin: { value: this.pos }
      },
      vertexShader: vShader,
      fragmentShader: fShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.MultiplyBlending
    });
    this.plane = new THREE.Mesh(planeGeom, planeMat);
    this.plane.position.setY(0.01);
    this.plane.rotateX(-Math.PI / 2);
    this.scene.add(this.plane);
  }
  Floor.prototype.addEdge = function () {
    var edgeMat = new THREE.MeshBasicMaterial({
      color: 16777215,
      wireframe: true
    });
    var edgeGeom = new THREE.PlaneGeometry(10, 10, 10, 10);
    var edge = new THREE.Mesh(edgeGeom, edgeMat);
    edge.rotateX(-Math.PI / 2);
    this.scene.add(edge);
  };
  return Floor;
}();
exports.default = Floor;