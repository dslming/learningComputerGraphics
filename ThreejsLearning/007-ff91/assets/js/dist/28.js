'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var utils_1 = require('./0');
var Props_1 = require('./1');
var motorVert = require('./12');
var motorFrag = require('./11');
var Motors = function () {
  function Motors(_parent, _object) {
    this.showing = false;
    this.parent = _parent;
    this.motorFrontSm = _object.getObjectByName('MotorFront');
    this.geomFront = this.motorFrontSm.geometry;
    this.motorBackR = _object.getObjectByName('MotorBack');
    this.geomBack = this.motorBackR.geometry;
    this.buildMotors();
  }
  Motors.prototype.buildMotors = function () {
    utils_1.scaleAndCenter(this.geomFront, { z: Props_1.FF91.WheelTrack / 6 }, 'xz');
    utils_1.scaleAndCenter(this.geomBack, { z: Props_1.FF91.WheelTrack / 4 }, 'xz');
    var wPosY = Props_1.FF91.WheelDiam / 2;
    var wPosF = Props_1.FF91.WheelBase / 2;
    this.motorBackL = this.motorBackR.clone(true);
    this.motorBackL.scale.x = -1;
    this.motorBackL.rotateZ(Math.PI);
    this.motorBackL.position.set(-wPosF, wPosY, 0);
    this.motorBackR.position.set(-wPosF, wPosY, 0);
    this.motorFrontLg = this.motorBackR.clone(true);
    this.motorFrontLg.scale.y = -1;
    this.motorFrontLg.scale.x = -1;
    this.motorFrontLg.position.set(wPosF, wPosY, 0);
    this.motorFrontSm.position.set(wPosF, wPosY, -0.1);
    this.material = new THREE.RawShaderMaterial({
      uniforms: { progress: { value: 0 } },
      vertexShader: motorVert,
      fragmentShader: motorFrag,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });
    this.progUniform = this.material.uniforms['progress'];
    this.motorFrontSm.material = this.motorFrontLg.material = this.motorBackR.material = this.motorBackL.material = this.material;
    this.group = new THREE.Group();
    this.group.visible = false;
    this.group.add(this.motorBackR);
    this.group.add(this.motorBackL);
    this.group.add(this.motorFrontSm);
    this.group.add(this.motorFrontLg);
    this.group.scale.set(2000, 2000, 2000);
    this.group.position.setX(wPosF);
    this.parent.add(this.group);
  };
  Motors.prototype.show = function () {
    if (!this.showing) {
      this.showing = true;
      this.group.visible = true;
      TweenLite.killTweensOf(this);
      TweenLite.to(this.progUniform, 2, {
        value: 1,
        ease: Power2.easeOut
      });
    }
  };
  Motors.prototype.hide = function () {
    if (this.showing) {
      this.showing = false;
      TweenLite.killTweensOf(this);
      TweenLite.to(this.progUniform, 1, {
        value: 0,
        ease: Power2.easeInOut,
        onComplete: function () {
          this.group.visible = false;
        }.bind(this)
      });
    }
  };
  return Motors;
}();
exports.default = Motors;