import headLightsVS from './shader/head_light_vert.glsl'
import headLightsFS from './shader/head_light_frag.glsl'

import tailLightVS from './shader/tail_light_vert.glsl'
import tailGridVS from './shader/tail_grid_vert.glsl'
import tailGridFS from './shader/tail_grid_frag.glsl'
import flareVS from './shader/flare_vert.glsl'
import flareFS from './shader/flare_frag.glsl'
import turnBarVS from './shader/turn_bar_vert.glsl'
import stopBarVS from './shader/turn_bar_vert.glsl'
import turnBarFS from './shader/turn_bar_frag.glsl'

const THREE = (window as any).THREE

export default class CarLights {
    lfTimer: number;
    rtTimer: number;
    carChassis: any;
    lightsCtrlTurn: any;
    lightsCtrlOther: any;
    lightsCtrlHead: any;
    prevHeadlightState: undefined;
    prevTurnState: undefined;
    headFlareMat: any;
    // 近光灯
    flareHeadPoints: any;
    meshStopGlow: any;
    turnPointMaterial: any;
    turnLeftPoints: any;
    turnRightPoints: any;
    
  constructor(_carChassis: any, _cargo: { getTexture: { (arg0: string): void; (arg0: string): void; (arg0: string): void; (arg0: string): void; }; }) {
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

  addMeshMaterials() {
    var headLights:any = this.carChassis.getObjectByName('HeadLights');
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
  }

  addHeadFlares(_tex: any) {
    this.headFlareMat = new THREE.ShaderMaterial({
      uniforms: {
        texture: { value: _tex },
        vpH: { value: window.innerHeight },
        size: { value: 1.5 },
        brightness: { value: 1 }
      },
      vertexShader: flareVS,
      fragmentShader: flareFS, // 有问题
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
    this.flareHeadPoints.name = 'flareHeadPoints'
    this.carChassis.add(this.flareHeadPoints);
  }

  addStopMesh(_tex: any) {
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
  }

  addTurnFlares(_tex1: any, _tex2: any) {
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
  }

  turnSignalsBlink(_angle: number, _tDelta: number) {
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
  }

  turnSignalsClear() {
    this.lightsCtrlTurn.set(0, 0, 0);
    this.lfTimer = 0;
    this.rtTimer = 0;
    this.turnLeftPoints.visible = false;
    this.turnRightPoints.visible = false;
  }

  headlightsChanged(_newState: any) {
    console.error(_newState)
    switch (_newState) {
    // 全部关闭 lightsCtrlHead: lightsS
    case 0:
      this.lightsCtrlHead.set(0, 0, 0, 0);
      this.flareHeadPoints.visible = false;
      break;
    // 白天行车灯
    case 1:
      this.lightsCtrlHead.set(1, 0, 0, 0);
      this.flareHeadPoints.visible = false;
      break;
    // 白天行车灯 + 大灯 
    case 2:
      this.lightsCtrlHead.set(1, 1, 0, 0);
      this.flareHeadPoints.visible = true;
      break;

    // 白天行车灯 + 大灯 + 远光灯
    case 3:
      this.lightsCtrlHead.set(1, 1, 1, 0);
      this.flareHeadPoints.visible = true;
      break;

    // 白天行车灯 + 大灯 + 远光灯 + 雾灯
    case 4:
      this.lightsCtrlHead.set(1, 1, 1, 1);
      this.flareHeadPoints.visible = true;
      break;
    }
    this.prevHeadlightState = _newState;
  }

  onWindowResize(_vpH: any) {
    this.headFlareMat.uniforms['vpH'].value = _vpH;
    this.turnPointMaterial.uniforms['vpH'].value = _vpH;
  }

  update(_props: { wAngleTarg: number; time: { delta: any; }; headLights: any; braking: any; }) {
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
  }
}