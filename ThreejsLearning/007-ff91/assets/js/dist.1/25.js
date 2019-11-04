import { scaleAndCenter } from './0';
import { FF91 } from './1';
import battVert from './6';
import battFrag from './5';

export var Batts = function () {
  function Batts(_parent, _object) {
    this.showing = false;
    this.parent = _parent;
    this.singleBatt = _object.getObjectByName('Batt');
    this.singleGeom = this.singleBatt.geometry;
    scaleAndCenter(this.singleGeom, { x: FF91.WheelBase * 0.65 / 6 });
    this.singleGeom.computeVertexNormals();
    this.cloneBatts();
  }
  Batts.prototype.cloneBatts = function () {
    this.stringGeom = new THREE.InstancedBufferGeometry();
    this.stringGeom.index = this.singleGeom.index;
    this.stringGeom.attributes.position = this.singleGeom.attributes.position;
    this.stringGeom.attributes.normal = this.singleGeom.attributes.normal;
    var offsets = [];
    var battID = [];
    var xSpacing = FF91.WheelBase * 0.7 / 6;
    var zSpacing = FF91.WheelTrack * 0.7 / 6;
    for (var x = 0, i = 0; x < 6; x++) {
      for (var z = 0; z < 6; z++, i++) {
        offsets.push(-x * xSpacing, z * zSpacing, 0);
        battID.push(i);
      }
    }
    this.stringGeom.addAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3));
    this.stringGeom.addAttribute('battID', new THREE.InstancedBufferAttribute(new Float32Array(battID), 1));
    this.stringMat = new THREE.RawShaderMaterial({
      uniforms: { progress: { value: 0 } },
      vertexShader: battVert,
      fragmentShader: battFrag,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      side: THREE.BackSide
    });
    this.progUniform = this.stringMat.uniforms['progress'];
    this.stringMesh = new THREE.Mesh(this.stringGeom, this.stringMat);
    this.stringMesh.applyMatrix(this.singleBatt.matrix);
    this.stringMesh.position.set(0.65, 0.35, -0.5);
    this.stringMesh.visible = false;
    this.parent.add(this.stringMesh);
  };
  Batts.prototype.show = function () {
    if (!this.showing) {
      this.showing = true;
      this.stringMesh.visible = true;
      TweenLite.killTweensOf(this);
      TweenLite.to(this.progUniform, 1, {
        value: 36 + 4,
        ease: Power2.easeInOut
      });
    }
  };
  Batts.prototype.hide = function () {
    if (this.showing) {
      this.showing = false;
      TweenLite.killTweensOf(this);
      TweenLite.to(this.progUniform, 1, {
        value: 0,
        ease: Power2.easeInOut,
        onComplete: function () {
          this.stringMesh.visible = false;
        }.bind(this)
      });
    }
  };
  return Batts;
}();