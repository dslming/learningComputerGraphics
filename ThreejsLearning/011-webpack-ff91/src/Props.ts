import { Time, normalizeQuadIn, zTween } from './Tool'
const THREE = (window as any).THREE

export class FF91Props {
  static Accel = 5;
  static Decel = -10;
  static MaxVel = 70 * 1610 / 3600;
  static MaxTurn = Math.PI * 0.2;
  static Length = 5.25;
  static Width = 2.283;
  static WheelTrack = 1.72;
  static WheelBase = 3.2;
  static WheelDiam = 0.78;
  static WheelCirc = FF91Props.WheelDiam * Math.PI;
  constructor () {
  }
}

// pc下 不同模式的相机参数
const Desktop = [
  // 尺寸
  {
    name: 'dimensions',
    size: {
      w: 930,
      h: 480
    },
    position: {
      x: 2,
      y: -1,
      z: 1
    },
    // 方向
    orientation: {
      x: -45,
      y: 35,
      z: 30
    },
    camDist: 6,
    camPos: {
      x: 2,
      y: 0,
      z: 1
    },
    camRot: {
      x: -45,
      y: 20
    },
    camRotRange: {
      x: 10,
      y: 10
    }
  },
  // 电池
  {
    name: 'battery',
    size: {
      w: 1000,
      h: 550
    },
    position: {
      x: 0,
      y: 0,
      z: 2.3
    },
    orientation: {
      x: -90,
      y: 0,
      z: 0
    },
    camDist: 5.7,
    camPos: {
      x: 0,
      y: 0.5,
      z: 1
    },
    camRot: {
      x: 0,
      y: 80
    },
    camRotRange: {
      x: 40,
      y: 50
    }
  },
  // 动力
  {
    name: 'powertrain',
    size: {
      w: 800,
      h: 540
    },
    position: {
      x: 2,
      y: 1,
      z: 2.8
    },
    orientation: {
      x: 0,
      y: -90,
      z: 0
    },
    camDist: 5,
    camPos: {
      x: -1,
      y: 1,
      z: 1.5
    },
    camRot: {
      x: 80,
      y: 0
    },
    camRotRange: {
      x: 10,
      y: 30
    }
  },
  // 驾驶
  {
    name: 'steering',
    size: {
      w: 900,
      h: 570
    },
    position: {
      x: 2,
      y: 1,
      z: -2.75
    },
    orientation: {
      x: 0,
      y: -90,
      z: 0
    },
    camDist: 5,
    camPos: {
      x: -1,
      y: 1,
      z: -1.5
    },
    camRot: {
      x: 100,
      y: 0
    },
    camRotRange: {
      x: 10,
      y: 10
    }
  },
  // 前灯
  {
    name: 'front-lighting',
    size: {
      w: 930,
      h: 520
    },
    position: {
      x: 0,
      y: 2.8,
      z: 0
    },
    orientation: {
      x: 0,
      y: 90,
      z: 0
    },
    camDist: 5,
    camPos: {
      x: 1,
      y: 1.2,
      z: 0
    },
    camRot: {
      x: -90,
      y: -5
    },
    camRotRange: {
      x: 30,
      y: 0
    },
    inverted: true
  },
  // 尾灯
  {
    name: 'rear-lighting',
    size: {
      w: 900,
      h: 400
    },
    position: {
      x: 0,
      y: 2.8,
      z: 0
    },
    orientation: {
      x: 0,
      y: -90,
      z: 0
    },
    camDist: 4,
    camPos: {
      x: -1,
      y: 1.5,
      z: 0
    },
    camRot: {
      x: 90,
      y: -5
    },
    camRotRange: {
      x: 30,
      y: 10
    },
    inverted: true
  },
  // 空气动力学
  {
    name: 'aerodynamics',
    size: {
      w: 930,
      h: 490
    },
    position: {
      x: 0,
      y: 3,
      z: -2
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0
    },
    camDist: 5,
    camPos: {
      x: 0,
      y: 1.5,
      z: 0
    },
    camRot: {
      x: 0,
      y: 0
    },
    camRotRange: {
      x: 10,
      y: 10
    }
  },
  // 自由浏览
  {
    name: 'free-viewing',
    size: {
      w: 465,
      h: 320
    },
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0
    },
    camDist: 6,
    camPos: {
      x: 0,
      y: 1,
      z: 0
    }
  }
]

var Mobile = JSON.parse(JSON.stringify(Desktop));
Mobile[1].camDist = 6.5;
Mobile[2].position = {
  x: 0,
  y: 2.8,
  z: 0.9
};
Mobile[2].camPos = {
  x: -1,
  y: 1.5,
  z: 1
};
Mobile[3].position = {
  x: 2,
  y: 2.8,
  z: -1.5
};
Mobile[3].camRot = {
  x: 95,
  y: 0
};
Mobile[3].camPos = {
  x: -1,
  y: 1.5,
  z: -1.5
};
Mobile[5].position = {
  x: 0,
  y: 3,
  z: 0
};
Mobile[5].camDist = 5;
Mobile[6].position = {
  x: 0,
  y: 3,
  z: 3
};
Mobile[6].camPos = {
  x: 0,
  y: 2,
  z: 0
};
Mobile[6].camDist = 9;
Mobile[7].camDist = 8;

export class CardProps {
    GOLDEN_RATIO = 1000
    static Mobile = Mobile
    static Desktop = Desktop
    time: Time;
    velocity: any;
    speed: number;
    accel: number;
    pos: any;
    longitMomentum: number;
    lateralMomentum: number;
    wAngleInner: number;
    wAngleOuter: number;
    wAngleTarg: number;
    joyVec: any;
    keys: any[];
    braking: boolean;
    headLights: number;
    omega: number;
    theta: number;
    frameDist: any;
    wAngleSign: any;
    radFrontIn: any;
    radBackIn: any;
    radBackOut: any;
    radFrontOut: any;

  constructor () {
    this.time = new Time(undefined);
    // 速度
    this.velocity = new THREE.Vector2();
    this.speed = 1;
    // 加速度
    this.accel = 0;
    this.pos = new THREE.Vector2();
    // 纵向推力
    this.longitMomentum = 0;
    // 横向推力
    this.lateralMomentum = 0;
    this.wAngleInner = 0;
    this.wAngleOuter = 0;
    this.wAngleTarg = 0;
    this.joyVec = new THREE.Vector2();
    this.keys = new Array();
    this.braking = false;
    this.headLights = 2;

    this.omega = 0
    this.theta = 0;
  }

  onKeyDown(evt: any) {
    if (this.keys.indexOf(evt.keyCode) === -1) {
      this.keys.push(evt.keyCode);
    }
  }

  onKeyUp(evt: any) {
    this.keys.splice(this.keys.indexOf(evt.keyCode), 1);
  }

  readKeyboardInput() {
    for (var i = 0; i < this.keys.length; i++) {
      switch (this.keys[i]) {
      case 38:
        this.accel += FF91Props.Accel;
        this.accel *= normalizeQuadIn(this.speed, FF91Props.MaxVel, FF91Props.MaxVel - 10);
        break;
      case 40:
        this.accel += FF91Props.Decel;
        break;
      case 37:
        this.wAngleTarg += FF91Props.MaxTurn;
        break;
      case 39:
        this.wAngleTarg -= FF91Props.MaxTurn;
        break;
      }
    }
  }

  onJoystickMove(_vec:any) {
    this.joyVec.x = _vec.x / -40;
    this.joyVec.y = _vec.y / -40;
    if (Math.abs(this.joyVec.x) > 0.85) {
      this.joyVec.y = 0;
    }
    if (Math.abs(this.joyVec.y) > 0.95) {
      this.joyVec.x = 0;
    }
  }

  onKnobMove(_vec:any, _section:any) {
    this.joyVec.x = _vec.x / -150;
    this.joyVec.y = _vec.y / -150;
    if (_section === 5 && Math.abs(this.joyVec.x) < 0.1) {
      this.joyVec.x = 0;
    }
  }

  readJoyStickInput() {
    this.wAngleTarg = this.joyVec.x * FF91Props.MaxTurn;
    if (this.joyVec.y >= 0) {
      this.accel = this.joyVec.y * FF91Props.Accel;
      this.accel *= normalizeQuadIn(this.speed, FF91Props.MaxVel, FF91Props.MaxVel - 10);
    } else {
      this.accel = this.joyVec.y * -FF91Props.Decel;
    }
  }

  changeHeadlights(_new:any) {
    this.headLights = THREE.Math.clamp(Math.round(_new), 0, 4);
  }

  update(_time:any) {
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
    this.wAngleTarg *= normalizeQuadIn(this.speed, FF91Props.MaxVel + 10, 3);
    this.wAngleInner = zTween(this.wAngleInner, this.wAngleTarg, this.time.delta * 2);
    this.wAngleSign = this.wAngleInner > 0.001 ? 1 : this.wAngleInner < -0.001 ? -1 : 0;
    this.omega = this.wAngleInner * this.speed / FF91Props.WheelBase;
    this.theta += this.omega * this.time.delta;
    this.velocity.set(Math.cos(this.theta) * this.frameDist, -Math.sin(this.theta) * this.frameDist);
    this.pos.add(this.velocity);
    this.longitMomentum = zTween(this.longitMomentum, this.accel / this.time.delta, this.time.delta * 6);
    this.lateralMomentum = this.omega * this.speed;
    if (this.wAngleSign) {
      this.radFrontIn = FF91Props.WheelBase / Math.sin(this.wAngleInner);
      this.radBackIn = FF91Props.WheelBase / Math.tan(this.wAngleInner);
      this.radBackOut = this.radBackIn + FF91Props.WheelTrack * this.wAngleSign;
      this.wAngleOuter = Math.atan(FF91Props.WheelBase / this.radBackOut);
      this.radFrontOut = FF91Props.WheelBase / Math.sin(this.wAngleOuter);
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