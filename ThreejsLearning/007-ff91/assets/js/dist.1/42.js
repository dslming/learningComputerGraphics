'use strict';
var __extends = this && this.__extends || function () {
  var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, '__esModule', { value: true });
var CamControl_1 = require('./41');
var __1 = require('./0');
var Monoc = function (_super) {
  __extends(Monoc, _super);
  function Monoc(options) {
    var _this = _super.call(this, options) || this;
    _this.camera = new THREE.PerspectiveCamera(_this.options.fov, _this.vpW / _this.vpH, 0.1, 100);
    return _this;
  }
  Monoc.prototype.onWindowResize = function (vpW, vpH) {
    _super.prototype.onWindowResize.call(this, vpW, vpH);
    this.camera.aspect = this.vpW / this.vpH;
    this.camera.updateProjectionMatrix();
  };
  Monoc.prototype.update = function () {
    if (!this.forceUpdate && !this.changesOccurred()) {
      return false;
    }
    this.focusActual.lerp(this.focusTarget, 0.05);
    this.camera.position.copy(this.focusActual);
    if (this.gyro.alpha && this.gyro.beta && this.gyro.gamma) {
      this.camera.setRotationFromEuler(this.defaultEuler);
      this.camera.rotateZ(this.gyro.alpha * CamControl_1.default.RADIANS);
      this.camera.rotateX(this.gyro.beta * CamControl_1.default.RADIANS);
      this.camera.rotateY(this.gyro.gamma * CamControl_1.default.RADIANS);
      this.camera.rotation.z += this.gyro.orient;
    } else {
      this.rotActual.lerp(this.rotTarget, 0.05);
      this.quatX.setFromAxisAngle(CamControl_1.default.AXIS_X, -THREE.Math.degToRad(this.rotActual.y));
      this.quatY.setFromAxisAngle(CamControl_1.default.AXIS_Y, -THREE.Math.degToRad(this.rotActual.x));
      this.quatY.multiply(this.quatX);
      this.camera.quaternion.copy(this.quatY);
    }
    if (this.distActual !== this.distTarget) {
      this.distActual = __1.zTween(this.distActual, this.distTarget, 0.05);
    }
    this.camera.translateZ(this.distActual);
    this.forceUpdate = false;
    return true;
  };
  return Monoc;
}(CamControl_1.default);
exports.default = Monoc;