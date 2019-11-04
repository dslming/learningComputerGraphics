var vShader = require('./22');
var fShader = require('./21');
var Grid = function () {
  function Grid(scene) {
    this.mouseActual = new THREE.Vector2(-0.2, 0.3);
    this.mouseTarget = new THREE.Vector2(THREE.Math.randInt(-40, 40), THREE.Math.randInt(-40, 40));
    this.tempVec = new THREE.Vector2();
    this.sprite = new THREE.TextureLoader().load('../assets/textures/led.png');
    this.shaderMat = new THREE.RawShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(16777215) },
        texture: { value: this.sprite },
        vpH: { value: window.innerHeight },
        time: { value: 0 },
        mousePos: { value: this.mouseActual },
        playhead: { value: 0 }
      },
      vertexShader: vShader,
      fragmentShader: fShader,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });
    this.uniformVPH = this.shaderMat.uniforms.vpH;
    this.uniformTime = this.shaderMat.uniforms.time;
    this.uniformMouse = this.shaderMat.uniforms.mousePos;
    this.uniformPlay = this.shaderMat.uniforms.playhead;
    var i3 = 0;
    var width = 80;
    var height = 80;
    this.vertCount = width * height;
    this.bufferGeom = new THREE.BufferGeometry();
    this.allPos = new Float32Array(this.vertCount * 3);
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++, i3 += 3) {
        this.allPos[i3 + 0] = x - Math.round(width / 2);
        this.allPos[i3 + 1] = y - Math.round(height / 2);
      }
    }
    this.bufferGeom.addAttribute('position', new THREE.BufferAttribute(this.allPos, 3));
    this.pointsObject = new THREE.Points(this.bufferGeom, this.shaderMat);
    this.pointsObject.scale.set(0.125, 0.125, 0.125);
    this.pointsObject.position.z = -0.5;
    scene.add(this.pointsObject);
  }
  Grid.prototype.onWindowResize = function (vpW, vpH) {
    this.uniformVPH.value = vpH;
  };
  Grid.prototype.onMouseMove = function (mouseX, mouseY) {
    this.mouseTarget.set((mouseX - 0.5) * 80, (mouseY - 0.5) * -80);
  };
  Grid.prototype.update = function (_time, playhead) {
    this.mouseActual.lerp(this.mouseTarget, 0.05);
    this.uniformMouse.value = this.mouseActual;
    this.uniformPlay.value = playhead;
    this.uniformTime.value = _time;
  };
  return Grid;
}();
exports.default = Grid;