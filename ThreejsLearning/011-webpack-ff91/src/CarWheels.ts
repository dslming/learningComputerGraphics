import { normalize } from './Tool'
import { FF91Props } from './Props'

const THREE = (window as any).THREE
export default class CarWheels {
    maxWheelTurn: number;
    carWhole: any;
    thread: any;
    ogMatrix: any;
    wPosFr: any;
    wPosBk: number;
    wPosLf: number;
    wPosRt: number;
    wPosY: number;
    wheelFL: any;
    wheelBL: any;
    wheelFR: any;
    wheelBR: any;
    brakeBL: any;
    brakeFL: any;
    brakeFR: any;
    brakeBR: any;
    rotOverall: any;
    rotFL: any;
    rotBL: any;
    rotFR: any;
    rotBR: any;
    ratioFO: any;
    ratioBO: any;
    ratioFI: any;
    ratioBI: any;

  constructor(_carWhole: any, _cargo: any) {
    this.maxWheelTurn = Math.PI / 9.69;
    this.carWhole = _carWhole;
    this.thread = _cargo.getTexture('thread');
    this.thread.minFilter = THREE.NearestFilter;
    this.thread.magFilter = THREE.LinearFilter;
    this.thread.format = THREE.RGBFormat;
    this.ogMatrix = new THREE.Matrix4().set(0.000788, 0, 0, -0.3939, 0, 0, 0.000788, -0.3939, 0, -0.000788, 0, 0.15, 0, 0, 0, 1);
    this.wPosFr = FF91Props.WheelBase;
    this.wPosBk = 0;
    this.wPosLf = FF91Props.WheelTrack / -2;
    this.wPosRt = FF91Props.WheelTrack / 2;
    this.wPosY = FF91Props.WheelDiam / 2;
    var wheelGeom:any = _cargo.getMesh('wheel');
    this.addWheels(wheelGeom.getObjectByName('Wheel'));
    // 刹车
    this.addBrakes(wheelGeom.getObjectByName('Brake'));
  }

  addWheels(_wheelGroup: any) {
    this.wheelFL = _wheelGroup;
    // 轮胎
    var meshRubber = this.wheelFL.getObjectByName('Tire');
    // 轮缘银
    var meshSilver = this.wheelFL.getObjectByName('RimsSilver');
    // 黑色轮辋
    var meshBlack = this.wheelFL.getObjectByName('RimsBlack');
    // 橡胶
    var geomRubber = meshRubber.geometry;
    // 银
    var geomSilver = meshSilver.geometry;
    // 黑
    var geomBlack = meshBlack.geometry;

    geomRubber.applyMatrix(this.ogMatrix);
    geomSilver.applyMatrix(this.ogMatrix);
    geomBlack.applyMatrix(this.ogMatrix);
    geomRubber.computeVertexNormals();
    geomSilver.computeVertexNormals();
    geomBlack.computeVertexNormals();

    var matRubber = new THREE.MeshLambertMaterial({
      color: 2105376,
      map: this.thread,
      side: THREE.DoubleSide
    });
    var matSilver = new THREE.MeshPhongMaterial({
      color: 10066329,
      shininess: 50,
      side: THREE.DoubleSide
    });
    var matBlack = new THREE.MeshPhongMaterial({
      color: 1118481, 
      shininess: 50,
      side: THREE.DoubleSide
    });
    meshRubber.material = matRubber;
    meshSilver.material = matSilver;
    meshBlack.material = matBlack;
    this.wheelFL.position.set(this.wPosFr, this.wPosY, this.wPosLf);
    this.carWhole.add(this.wheelFL);
    this.wheelBL = this.wheelFL.clone();
    this.wheelBL.position.set(this.wPosBk, this.wPosY, this.wPosLf);
    this.carWhole.add(this.wheelBL);
    var iGeomRubber = geomRubber.clone().scale(1, 1, -1);
    var iGeomSilver = geomSilver.clone().scale(1, 1, -1);
    var iGeomBlack = geomBlack.clone().scale(1, 1, -1);
    iGeomRubber.computeVertexNormals();
    iGeomSilver.computeVertexNormals();
    iGeomBlack.computeVertexNormals();
    var iMeshRubber = new THREE.Mesh(iGeomRubber, matRubber);
    var iMeshSilver = new THREE.Mesh(iGeomSilver, matSilver);
    var iMeshBlack = new THREE.Mesh(iGeomBlack, matBlack);
    this.wheelFR = new THREE.Group();
    this.wheelFR.add(iMeshRubber);
    this.wheelFR.add(iMeshSilver);
    this.wheelFR.add(iMeshBlack);
    this.wheelFR.position.set(this.wPosFr, this.wPosY, this.wPosRt);
    this.carWhole.add(this.wheelFR);
    this.wheelBR = this.wheelFR.clone();
    this.wheelBR.position.set(this.wPosBk, this.wPosY, this.wPosRt);
    this.carWhole.add(this.wheelBR);
  };
  addBrakes(_brakeGroup: any) {
    this.brakeBL = _brakeGroup;
    var brMeshDisc = this.brakeBL.getObjectByName('Disc');
    var brMeshPads = this.brakeBL.getObjectByName('Pad');
    brMeshDisc.geometry.applyMatrix(this.ogMatrix);
    brMeshPads.geometry.applyMatrix(this.ogMatrix);
    brMeshDisc.material = new THREE.MeshPhongMaterial({
      color: 5592405,
      shininess: 100,
      flatShading: true
    });
    brMeshPads.material = new THREE.MeshPhongMaterial({
      color: 3355443,
      shininess: 50,
      flatShading: true
    });
    this.brakeBL.position.set(this.wPosBk, this.wPosY, this.wPosLf);
    this.carWhole.add(this.brakeBL);
    this.brakeFL = this.brakeBL.clone();
    this.brakeFL.position.set(this.wPosFr, this.wPosY, this.wPosLf);
    this.brakeFL.rotation.set(0, 0, Math.PI);
    this.carWhole.add(this.brakeFL);
    this.brakeFR = this.brakeBL.clone();
    this.brakeFR.position.set(this.wPosFr, this.wPosY, this.wPosRt);
    this.brakeFR.rotation.set(Math.PI, 0, Math.PI);
    this.carWhole.add(this.brakeFR);
    this.brakeBR = this.brakeBL.clone();
    this.brakeBR.position.set(this.wPosBk, this.wPosY, this.wPosRt);
    this.brakeBR.rotation.set(Math.PI, 0, 0);
    this.carWhole.add(this.brakeBR);
  };
  turnByRadiusRatio(_props: { frameDist: number; wAngleSign: number; radFrontOut: number; radBackIn: number; radBackOut: number; radFrontIn: number; wAngleInner: number; wAngleOuter: number; speed: any; }) {
    this.rotOverall = -_props.frameDist / FF91Props.WheelCirc * Math.PI * 2;
    this.rotFL = this.rotBL = this.rotFR = this.rotBR = Math.max(this.rotOverall, -this.maxWheelTurn);
    if (_props.wAngleSign !== 0) {
      this.ratioFO = _props.radFrontOut / _props.radBackIn;
      this.ratioBO = _props.radBackOut / _props.radBackIn;
      this.ratioFI = _props.radFrontIn / _props.radBackIn;
      this.ratioBI = 1;
      if (_props.wAngleSign == 1) {
        this.rotFL *= this.ratioFI;
        this.rotBL *= this.ratioBI;
        this.rotFR *= this.ratioFO;
        this.rotBR *= this.ratioBO;
        this.wheelFL.rotation.y = _props.wAngleInner;
        this.wheelFR.rotation.y = _props.wAngleOuter;
        this.brakeFL.rotation.y = _props.wAngleInner;
        this.brakeFR.rotation.y = -_props.wAngleOuter;
      } else {
        this.rotFL *= this.ratioFO;
        this.rotBL *= this.ratioBO;
        this.rotFR *= this.ratioFI;
        this.rotBR *= this.ratioBI;
        this.wheelFL.rotation.y = _props.wAngleOuter;
        this.wheelFR.rotation.y = _props.wAngleInner;
        this.brakeFL.rotation.y = _props.wAngleOuter;
        this.brakeFR.rotation.y = -_props.wAngleInner;
      }
      this.brakeBL.rotation.y = this.wheelBR.rotation.y = this.wheelBL.rotation.y = normalize(_props.speed, 22.2, 0) * _props.wAngleInner * -0.09;
      this.brakeBR.rotation.y = -this.wheelBL.rotation.y;
    }
    this.wheelFL.rotateZ(this.rotFL);
    this.wheelBL.rotateZ(this.rotBL);
    this.wheelFR.rotateZ(this.rotFR);
    this.wheelBR.rotateZ(this.rotBR);
  };
  update(props: any) {
    this.turnByRadiusRatio(props);
  };
}