import motorVert from './shader/motor_vert.glsl'
import motorFrag from './shader/motor_frag.glsl'
import {scaleAndCenter} from './Tool'
import { FF91Props } from './Props'

const THREE = (window as any).THREE
const Power2 = (window as any).Power2
const TweenLite = (window as any).TweenLite

export default class Motors{
    showing: boolean;
    parent: any;
    motorFrontSm: any;
    geomFront: any;
    motorBackR: any;
    geomBack: any;
    group: any;
    motorBackL: any;
    motorFrontLg: any;
    material: any;
    progUniform: any;
  constructor(_parent: any, _object: { getObjectByName: { (arg0: string): void; (arg0: string): void; }; }) {
    this.showing = false;
    this.parent = _parent;
    this.motorFrontSm = _object.getObjectByName('MotorFront');
    this.geomFront = this.motorFrontSm.geometry;
    this.motorBackR = _object.getObjectByName('MotorBack');
    this.geomBack = this.motorBackR.geometry;
    this.buildMotors();
  }

  buildMotors () {
    scaleAndCenter(this.geomFront, { z: FF91Props.WheelTrack / 6 }, 'xz');
    scaleAndCenter(this.geomBack, { z: FF91Props.WheelTrack / 4 }, 'xz');
    var wPosY = FF91Props.WheelDiam / 2;
    var wPosF = FF91Props.WheelBase / 2;
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
  }

  show() {
    if (!this.showing) {
      this.showing = true;
      this.group.visible = true;
      TweenLite.killTweensOf(this);
      TweenLite.to(this.progUniform, 2, {
        value: 1,
        ease: Power2.easeOut
      });
    }
  }

  hide() {
    if (this.showing) {
      this.showing = false;
      TweenLite.killTweensOf(this);
      TweenLite.to(this.progUniform, 1, {
        value: 0,
        ease: Power2.easeInOut,
        onComplete: () => {
          this.group.visible = false;
        }
      });
    }
  };
}