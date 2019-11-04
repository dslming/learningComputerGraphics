import { Time, normalizeQuadIn, zTween } from './Time'

export var FF91 = function () {
  function FF91() {
  }
  FF91.Accel = 5;
  FF91.Decel = -10;
  FF91.MaxVel = 70 * 1610 / 3600;
  FF91.MaxTurn = Math.PI * 0.2;
  FF91.Length = 5.25;
  FF91.Width = 2.283;
  FF91.WheelTrack = 1.72;
  FF91.WheelBase = 3.2;
  FF91.WheelDiam = 0.78;
  FF91.WheelCirc = FF91.WheelDiam * Math.PI;
  return FF91;
}();

export class CarProps {
  constructor () {
    this.time = new Time();
    this.velocity = new THREE.Vector2();
    this.speed = 1;
    this.accel = 0;
    this.pos = new THREE.Vector2();
    this.longitMomentum = 0;
    this.lateralMomentum = 0;
    this.wAngleInner = 0;
    this.wAngleOuter = 0;
    this.wAngleTarg = 0;
    this.joyVec = new THREE.Vector2();
    this.keys = new Array();
    this.braking = false;
    this.headLights = 2;
    this.omega = 0;
    this.theta = 0;
  }

  onKeyDown(evt) {
    if (this.keys.indexOf(evt.keyCode) === -1) {
      this.keys.push(evt.keyCode);
    }
  }

  onKeyUp(evt) {
    this.keys.splice(this.keys.indexOf(evt.keyCode), 1);
  }

  readKeyboardInput() {
    for (var i = 0; i < this.keys.length; i++) {
      switch (this.keys[i]) {
      case 38:
        this.accel += FF91.Accel;
        this.accel *= normalizeQuadIn(this.speed, FF91.MaxVel, FF91.MaxVel - 10);
        break;
      case 40:
        this.accel += FF91.Decel;
        break;
      case 37:
        this.wAngleTarg += FF91.MaxTurn;
        break;
      case 39:
        this.wAngleTarg -= FF91.MaxTurn;
        break;
      }
    }
  }

  onJoystickMove(_vec) {
    this.joyVec.x = _vec.x / -40;
    this.joyVec.y = _vec.y / -40;
    if (Math.abs(this.joyVec.x) > 0.85) {
      this.joyVec.y = 0;
    }
    if (Math.abs(this.joyVec.y) > 0.95) {
      this.joyVec.x = 0;
    }
  }

  onKnobMove(_vec, _section) {
    this.joyVec.x = _vec.x / -150;
    this.joyVec.y = _vec.y / -150;
    if (_section === 5 && Math.abs(this.joyVec.x) < 0.1) {
      this.joyVec.x = 0;
    }
  }

  readJoyStickInput() {
    this.wAngleTarg = this.joyVec.x * FF91.MaxTurn;
    if (this.joyVec.y >= 0) {
      this.accel = this.joyVec.y * FF91.Accel;
      this.accel *= normalizeQuadIn(this.speed, FF91.MaxVel, FF91.MaxVel - 10);
    } else {
      this.accel = this.joyVec.y * -FF91.Decel;
    }
  }

  changeHeadlights(_new) {
    this.headLights = THREE.Math.clamp(Math.round(_new), 0, 4);
  }

  update(_time) {
    if (this.time.update(_time) === false) {
      return false;
    }
    this.accel = 0;
    this.wAngleTarg = 0;
    if (this.keys.length > 0) {
      this.readKeyboardInput();
    } else if (this.joyVec.x != 0 || this.joyVec.y != 0) {
      this.readJoyStickInput();
    }
    this.accel *= this.time.delta;
    this.speed += this.accel;
    this.braking = this.accel < 0;
    if (this.speed < 0) {
      this.speed = 0;
      this.accel = 0;
    }
    this.frameDist = this.speed * this.time.delta;
    this.wAngleTarg *= normalizeQuadIn(this.speed, FF91.MaxVel + 10, 3);
    this.wAngleInner = zTween(this.wAngleInner, this.wAngleTarg, this.time.delta * 2);
    this.wAngleSign = this.wAngleInner > 0.001 ? 1 : this.wAngleInner < -0.001 ? -1 : 0;
    this.omega = this.wAngleInner * this.speed / FF91.WheelBase;
    this.theta += this.omega * this.time.delta;
    this.velocity.set(Math.cos(this.theta) * this.frameDist, -Math.sin(this.theta) * this.frameDist);
    this.pos.add(this.velocity);
    this.longitMomentum = zTween(this.longitMomentum, this.accel / this.time.delta, this.time.delta * 6);
    this.lateralMomentum = this.omega * this.speed;
    if (this.wAngleSign) {
      this.radFrontIn = FF91.WheelBase / Math.sin(this.wAngleInner);
      this.radBackIn = FF91.WheelBase / Math.tan(this.wAngleInner);
      this.radBackOut = this.radBackIn + FF91.WheelTrack * this.wAngleSign;
      this.wAngleOuter = Math.atan(FF91.WheelBase / this.radBackOut);
      this.radFrontOut = FF91.WheelBase / Math.sin(this.wAngleOuter);
    } else {
      this.radFrontOut = 100;
      this.radBackOut = 100;
      this.radBackIn = 100;
      this.radFrontIn = 100;
      this.wAngleOuter = 0;
    }
    return true;
  }
}