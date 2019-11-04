var shaderVert = require('./24');
var shaderFrag = require('./23');
var Skybox = function () {
  function Skybox(_scene, _color) {
    var boxGeom = new THREE.BoxBufferGeometry(1, 1, 1);
    this.boxMat = new THREE.ShaderMaterial({
      uniforms: {
        tCube: { value: null },
        tFlip: { value: -1 },
        color: { value: _color }
      },
      vertexShader: shaderVert,
      fragmentShader: shaderFrag,
      side: THREE.BackSide,
      depthTest: true,
      depthWrite: false,
      fog: false
    });
    var boxMesh = new THREE.Mesh(boxGeom, this.boxMat);
    boxMesh.name = 'boxMesh'
    boxGeom.removeAttribute('normal');
    boxGeom.removeAttribute('uv');
    _scene.add(boxMesh);
    boxMesh.onBeforeRender = function (renderer, scene, camera) {
      this.matrixWorld.copyPosition(camera.matrixWorld);
    };
  }
  Skybox.prototype.updateLight = function (_newVal) {
    this.boxMat.uniforms.light.value = _newVal;
  };
  Skybox.prototype.setCubeTexture = function (_cubeTex) {
    this.boxMat.uniforms.tCube.value = _cubeTex;
  };
  return Skybox;
}();
exports.default = Skybox;