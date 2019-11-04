'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var headLightsVS = require('./10');
var headLightsFS = require('./9');
var tailLightVS = require('./16');
var tailGridVS = require('./14');
var tailGridFS = require('./15');
var flareVS = require('./8');
var flareFS = require('./7');
var turnBarVS = require('./18');
var stopBarVS = require('./13');
var turnBarFS = require('./17');
var CarLights = function () {
  function CarLights(_carChassis, _cargo) {
    this.lfTimer = 0;
    this.rtTimer = 0;
    this.carChassis = _carChassis;
    this.lightsCtrlTurn = new THREE.Vector3();
    this.lightsCtrlOther = new THREE.Vector3();
    this.lightsCtrlHead = new THREE.Vector4();
    this.prevHeadlightState = undefined;
    this.prevTurnState = undefined;
    this.addMeshMaterials();
    this.addHeadFlares(_cargo.getTexture('flareHead'));
    this.addStopMesh(_cargo.getTexture('lightStop'));
    this.addTurnFlares(_cargo.getTexture('flareTurn'), _cargo.getTexture('lightTurn'));
  }
  CarLights.prototype.addMeshMaterials = function () {
    var headLights = this.carChassis.getObjectByName('HeadLights');
    var tailLights = this.carChassis.getObjectByName('TailLights');
    var tailGrid = this.carChassis.getObjectByName('TailGrid');
    tailGrid.geometry.computeVertexNormals();
    headLights.material = new THREE.ShaderMaterial({
      uniforms: {
        lightsT: { value: this.lightsCtrlTurn },
        lightsS: { value: this.lightsCtrlHead }
      },
      vertexShader: headLightsVS,
      fragmentShader: headLightsFS
    });
    tailLights.material = new THREE.ShaderMaterial({
      uniforms: {
        lightsT: { value: this.lightsCtrlTurn },
        lightsO: { value: this.lightsCtrlOther }
      },
      vertexShader: tailLightVS,
      fragmentShader: tailGridFS
    });
    tailGrid.material = new THREE.ShaderMaterial({
      uniforms: {
        lightsT: { value: this.lightsCtrlTurn },
        lightsO: { value: this.lightsCtrlOther }
      },
      vertexShader: tailGridVS,
      fragmentShader: tailGridFS
    });
  };
  CarLights.prototype.addHeadFlares = function (_tex) {
    this.headFlareMat = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: _tex },
        vpH: { value: window.innerHeight },
        size: { value: 1.5 },
        brightness: { value: 1 }
      },
      vertexShader: flareVS,
      fragmentShader: flareFS,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });
    var posArray = new Float32Array([
      4000,
      1875,
      1700,
      4300,
      1800,
      1700,
      4000,
      1875,
      -1700,
      4300,
      1800,
      -1700
    ]);
    var normArray = new Float32Array([
      0.87,
      0.22,
      0.44,
      0.87,
      0.22,
      0.44,
      0.87,
      0.22,
      -0.44,
      0.87,
      0.22,
      -0.44
    ]);
    var flareHeadGeom = new THREE.BufferGeometry();
    flareHeadGeom.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
    flareHeadGeom.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
    this.flareHeadPoints = new THREE.Points(flareHeadGeom, this.headFlareMat);
    this.carChassis.add(this.flareHeadPoints);
  };
  CarLights.prototype.addStopMesh = function (_tex) {
    this.meshStopGlow = this.carChassis.getObjectByName('Stop');
    this.meshStopGlow.material = new THREE.ShaderMaterial({
      uniforms: { texture: { value: _tex } },
      vertexShader: stopBarVS,
      fragmentShader: turnBarFS,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });
    ;
  };
  CarLights.prototype.addTurnFlares = function (_tex1, _tex2) {
    var posArray = new Float32Array([
      -4755,
      2227,
      -1269,
      -4703,
      2222,
      -1326,
      -4649,
      2215,
      -1381,
      -4590,
      2208,
      -1436,
      -4526,
      2200,
      -1492,
      -4459,
      2192,
      -1548,
      -4386,
      2182,
      -1604,
      -4718,
      2182,
      -1264,
      -4668,
      2179,
      -1321,
      -4301,
      2175,
      -1658,
      -4614,
      2175,
      -1377,
      -4556,
      2168,
      -1433,
      -4494,
      2163,
      -1489,
      -4429,
      2158,
      -1545,
      -4358,
      2151,
      -1600,
      -4266,
      2147,
      -1653,
      -4675,
      2136,
      -1260,
      -4627,
      2134,
      -1316,
      -4575,
      2132,
      -1373,
      -4520,
      2130,
      -1428,
      -4461,
      2128,
      -1485,
      -4400,
      2126,
      -1540,
      -4329,
      2123,
      -1597
    ]);
    var normArray = new Float32Array([
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4,
      -0.9,
      0,
      -0.4
    ]);
    this.turnPointMaterial = this.headFlareMat.clone();
    this.turnPointMaterial.uniforms['texture'].value = _tex1;
    this.turnPointMaterial.uniforms['size'].value = 0.1;
    this.turnPointMaterial.uniforms['brightness'].value = 1;
    var leftTurnGrid = new THREE.BufferGeometry();
    leftTurnGrid.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
    leftTurnGrid.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
    this.turnLeftPoints = new THREE.Points(leftTurnGrid, this.turnPointMaterial);
    this.turnLeftPoints.visible = false;
    this.carChassis.add(this.turnLeftPoints);
    posArray = new Float32Array([
      -4755,
      2227,
      1269,
      -4703,
      2222,
      1326,
      -4649,
      2215,
      1381,
      -4590,
      2208,
      1436,
      -4526,
      2200,
      1492,
      -4459,
      2192,
      1548,
      -4386,
      2182,
      1604,
      -4718,
      2182,
      1264,
      -4668,
      2179,
      1321,
      -4301,
      2175,
      1658,
      -4614,
      2175,
      1377,
      -4556,
      2168,
      1433,
      -4494,
      2163,
      1489,
      -4429,
      2158,
      1545,
      -4358,
      2151,
      1600,
      -4266,
      2147,
      1653,
      -4675,
      2136,
      1260,
      -4627,
      2134,
      1316,
      -4575,
      2132,
      1373,
      -4520,
      2130,
      1428,
      -4461,
      2128,
      1485,
      -4400,
      2126,
      1540,
      -4329,
      2123,
      1597
    ]);
    normArray = new Float32Array([
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4,
      -0.9,
      0,
      0.4
    ]);
    var rightTurnGrid = new THREE.BufferGeometry();
    rightTurnGrid.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
    rightTurnGrid.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
    this.turnRightPoints = new THREE.Points(rightTurnGrid, this.turnPointMaterial);
    this.turnRightPoints.visible = false;
    this.carChassis.add(this.turnRightPoints);
    this.carChassis.getObjectByName('Turn').material = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: _tex2 },
        lightsT: { value: this.lightsCtrlTurn }
      },
      vertexShader: turnBarVS,
      fragmentShader: turnBarFS,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    });
  };
  CarLights.prototype.turnSignalsBlink = function (_angle, _tDelta) {
    this.lightsCtrlTurn.x = Math.sign(_angle);
    if (_angle > 0) {
      this.lfTimer = (this.lfTimer + _tDelta * 2) % 2;
      this.rtTimer = 0;
      this.lightsCtrlTurn.y = this.lfTimer > 1 ? 0 : 1;
      this.lightsCtrlTurn.z = 0;
    } else if (_angle < 0) {
      this.lfTimer = 0;
      this.rtTimer = (this.rtTimer + _tDelta * 2) % 2;
      this.lightsCtrlTurn.y = 0;
      this.lightsCtrlTurn.z = this.rtTimer > 1 ? 0 : 1;
    }
    this.turnLeftPoints.visible = this.lightsCtrlTurn.y ? true : false;
    this.turnRightPoints.visible = this.lightsCtrlTurn.z ? true : false;
  };
  CarLights.prototype.turnSignalsClear = function () {
    this.lightsCtrlTurn.set(0, 0, 0);
    this.lfTimer = 0;
    this.rtTimer = 0;
    this.turnLeftPoints.visible = false;
    this.turnRightPoints.visible = false;
  };
  CarLights.prototype.headlightsChanged = function (_newState) {
    switch (_newState) {
    case 0:
      this.lightsCtrlHead.set(0, 0, 0, 0);
      this.flareHeadPoints.visible = false;
      break;
    case 1:
      this.lightsCtrlHead.set(1, 0, 0, 0);
      this.flareHeadPoints.visible = false;
      break;
    case 2:
      this.lightsCtrlHead.set(1, 1, 0, 0);
      this.flareHeadPoints.visible = true;
      break;
    case 3:
      this.lightsCtrlHead.set(1, 1, 1, 0);
      this.flareHeadPoints.visible = true;
      break;
    case 4:
      this.lightsCtrlHead.set(1, 1, 1, 1);
      this.flareHeadPoints.visible = true;
      break;
    }
    this.prevHeadlightState = _newState;
  };
  CarLights.prototype.onWindowResize = function (_vpH) {
    this.headFlareMat.uniforms['vpH'].value = _vpH;
    this.turnPointMaterial.uniforms['vpH'].value = _vpH;
  };
  CarLights.prototype.update = function (_props) {
    if (_props.wAngleTarg !== 0) {
      this.turnSignalsBlink(_props.wAngleTarg, _props.time.delta);
    } else if (this.lightsCtrlTurn.x !== 0) {
      this.turnSignalsClear();
    }
    if (this.prevHeadlightState !== _props.headLights) {
      this.headlightsChanged(_props.headLights);
    }
    if (_props.braking && !this.meshStopGlow.visible) {
      this.meshStopGlow.visible = true;
      this.lightsCtrlOther.x = 1;
    } else if (!_props.braking && this.meshStopGlow.visible) {
      this.meshStopGlow.visible = false;
      this.lightsCtrlOther.x = 0;
    }
  };
  return CarLights;
}();
exports.default = CarLights;