
var Wheels_1 = require('./29');
var Lights_1 = require('./27');
var Motors_1 = require('./28');
var Batts_1 = require('./25');

class CarBody {
  constructor(_scene, _cargo) {
    this.parent = _scene;
    this.carWhole = new THREE.Group();
    this.carWhole.position.x = -1.56;
    this.parent.add(this.carWhole);
    this.carChassis = this.buildCarChassis(_cargo.getMesh('body'), _cargo.getCubeTexture('envReflection'));
    this.carWhole.add(this.carChassis);
    this.addShadow(_cargo.getTexture('shadow'));
    this.carLights = new Lights_1.default(this.carChassis, _cargo);
    this.carWheels = new Wheels_1.default(this.carWhole, _cargo);
    this.carMotors = new Motors_1.default(this.carChassis, _cargo.getMesh('xrays'));
    this.carBatts = new Batts_1.default(this.carWhole, _cargo.getMesh('xrays'));
  }

  buildCarChassis(_bodyGeom, _cubeText) {
    _bodyGeom.scale.set(0.0005, 0.0005, 0.0005);
    _bodyGeom.position.set(1.56, 0, 0);
    this.envCube = _cubeText;
    this.envCube.format = THREE.RGBFormat;
    this.matBodySilver = new THREE.MeshStandardMaterial({
      color: 12303291,
      metalness: 0.7,
      roughness: 0.7
    });
    if (window['EXT_STLOD_SUPPORT'] === false) {
      this.envCube.minFilter = THREE.LinearFilter;
      this.matBodySilver.metalness = 0.05;
      this.matBodySilver.roughness = 0.8;
      this.matBodySilver.color = new THREE.Color(7829367);
    }
    this.matBodyBlack = new THREE.MeshLambertMaterial({
      color: 2236962,
      reflectivity: 0.8,
      envMap: this.envCube
    });
    this.matGlassTinted = new THREE.MeshLambertMaterial({
      color: 6710886,
      reflectivity: 1,
      envMap: this.envCube
    });
    this.matUndercarriage = new THREE.MeshBasicMaterial({ color: 0 });
    this.matGlassTransp = new THREE.MeshLambertMaterial({
      color: 6710886,
      reflectivity: 1,
      envMap: this.envCube,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    _bodyGeom.getObjectByName('BodyBlack').material = this.matBodyBlack;
    _bodyGeom.getObjectByName('BodySilver').material = this.matBodySilver;
    _bodyGeom.getObjectByName('GlassTransparent').material = this.matGlassTransp;
    _bodyGeom.getObjectByName('GlassTinted').material = this.matGlassTinted;
    _bodyGeom.getObjectByName('Undercarriage').material = this.matUndercarriage;
    return _bodyGeom;
  }
  
  addShadow(_shad) {
    var shadowPlane = new THREE.PlaneBufferGeometry(6.5, 6.5, 1, 1);
    shadowPlane.rotateX(-Math.PI / 2);
    shadowPlane.translate(1.56, 0, 0);
    var shadowMat = new THREE.MeshBasicMaterial({
      map: _shad,
      blending: THREE.MultiplyBlending,
      transparent: true
    });
    var shadowMesh = new THREE.Mesh(shadowPlane, shadowMat);
    this.carWhole.add(shadowMesh);
  }

  onWindowResize(_vpH) {
    this.carLights.onWindowResize(_vpH);
  }

  update(_props) {
    this.carWhole.rotation.y = _props.theta;
    if (_props.longitMomentum !== 0) {
      this.carChassis.rotation.z = _props.longitMomentum * 0.0015;
    }
    this.carChassis.rotation.x = _props.lateralMomentum * 0.002;
    this.carWheels.update(_props);
    this.carLights.update(_props);
  }
}

exports.default = CarBody;