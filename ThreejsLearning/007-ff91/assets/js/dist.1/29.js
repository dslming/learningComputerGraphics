var Props_1 = require('./CarProps');
var utils_1 = require('./Time');
var CarWheels = function () {
  function CarWheels(_carWhole, _cargo) {
    this.maxWheelTurn = Math.PI / 9.69;
    this.carWhole = _carWhole;
    this.thread = _cargo.getTexture('thread');
    this.thread.minFilter = THREE.NearestFilter;
    this.thread.magFilter = THREE.LinearFilter;
    this.thread.format = THREE.RGBFormat;
    this.ogMatrix = new THREE.Matrix4().set(0.000788, 0, 0, -0.3939, 0, 0, 0.000788, -0.3939, 0, -0.000788, 0, 0.15, 0, 0, 0, 1);
    this.wPosFr = Props_1.FF91.WheelBase;
    this.wPosBk = 0;
    this.wPosLf = Props_1.FF91.WheelTrack / -2;
    this.wPosRt = Props_1.FF91.WheelTrack / 2;
    this.wPosY = Props_1.FF91.WheelDiam / 2;
    var wheelGeom = _cargo.getMesh('wheel');
    this.addWheels(wheelGeom.getObjectByName('Wheel'));
    this.addBrakes(wheelGeom.getObjectByName('Brake'));
  }
  CarWheels.prototype.addWheels = function (_wheelGroup) {
    this.wheelFL = _wheelGroup;
    var meshRubber = this.wheelFL.getObjectByName('Tire');
    var meshSilver = this.wheelFL.getObjectByName('RimsSilver');
    var meshBlack = this.wheelFL.getObjectByName('RimsBlack');
    var geomRubber = meshRubber.geometry;
    var geomSilver = meshSilver.geometry;
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
  CarWheels.prototype.addBrakes = function (_brakeGroup) {
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
  CarWheels.prototype.turnByRadiusRatio = function (_props) {
    this.rotOverall = -_props.frameDist / Props_1.FF91.WheelCirc * Math.PI * 2;
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
      this.brakeBL.rotation.y = this.wheelBR.rotation.y = this.wheelBL.rotation.y = utils_1.normalize(_props.speed, 22.2, 0) * _props.wAngleInner * -0.09;
      this.brakeBR.rotation.y = -this.wheelBL.rotation.y;
    }
    this.wheelFL.rotateZ(this.rotFL);
    this.wheelBL.rotateZ(this.rotBL);
    this.wheelFR.rotateZ(this.rotFR);
    this.wheelBR.rotateZ(this.rotBR);
  };
  CarWheels.prototype.update = function (props) {
    this.turnByRadiusRatio(props);
  };
  return CarWheels;
}();
exports.default = CarWheels;