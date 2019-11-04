var CardControls = function () {
  function CardControls(_parent) {
    this.parent = _parent;
    this.closeX = document.getElementById('closeX');
    this.frontButtons = document.getElementsByClassName('frontLightBut');
    this.powerKnob = document.getElementById('powerKnob');
    this.steerKnob = document.getElementById('steerKnob');
    this.rearKnob = document.getElementById('rearKnob');
    this.activeKnob = null;
    this.knobPos = new THREE.Vector2();
    for (var i = 0; i < this.frontButtons.length; i++) {
      this.frontButtons[i].addEventListener('click', this.frontLightClick.bind(this, i), false);
    }
    this.closeX.addEventListener('click', this.closeXClick.bind(this), false);
    this.powerKnob.addEventListener('mousedown', this.mousedownKnob.bind(this, 0), true);
    this.powerKnob.addEventListener('touchstart', this.mousedownKnob.bind(this, 0), true);
    this.steerKnob.addEventListener('mousedown', this.mousedownKnob.bind(this, 1), true);
    this.steerKnob.addEventListener('touchstart', this.mousedownKnob.bind(this, 1), true);
    this.rearKnob.addEventListener('mousedown', this.mousedownKnob.bind(this, 2), true);
    this.rearKnob.addEventListener('touchstart', this.mousedownKnob.bind(this, 2), true);
  }
  CardControls.prototype.mousedownKnob = function (index, event) {
    switch (index) {
    case 0:
      this.activeKnob = this.powerKnob;
      break;
    case 1:
      this.activeKnob = this.steerKnob;
      break;
    case 2:
      this.activeKnob = this.rearKnob;
      break;
    }
    this.parent.knobMouseDown();
  };
  CardControls.prototype.knobMoved = function (xDisp, yDisp) {
    switch (this.activeKnob) {
    case this.powerKnob:
      this.knobPos.set(0, THREE.Math.clamp(yDisp, -150, 150));
      this.renderKnobPos();
      break;
    case this.steerKnob:
      this.knobPos.set(THREE.Math.clamp(xDisp, -150, 150), 0);
      this.renderKnobPos();
      break;
    case this.rearKnob:
      this.knobPos.set(THREE.Math.clamp(xDisp, -150, 150), THREE.Math.clamp(yDisp, 0, 10));
      this.renderKnobPos();
      break;
    }
  };
  CardControls.prototype.knobReleased = function () {
    TweenLite.to(this.knobPos, 0.5, {
      x: 0,
      y: 0,
      onUpdate: this.renderKnobPos.bind(this)
    });
  };
  CardControls.prototype.renderKnobPos = function () {
    if (this.activeKnob !== null) {
      this.activeKnob.setAttribute('transform', 'translate(' + this.knobPos.x + ', ' + this.knobPos.y + ')');
      this.parent.knobMouseMoved(this.knobPos);
    }
  };
  CardControls.prototype.frontLightClick = function (_index, _evt) {
    if (this.frontButtons[_index].classList.contains('active')) {
      for (var i = _index; i < this.frontButtons.length; i++) {
        this.frontButtons[i].classList.remove('active');
      }
      this.parent.frontLightsChanged(_index);
    } else {
      for (var i = 0; i < this.frontButtons.length; i++) {
        if (i <= _index) {
          this.frontButtons[i].classList.add('active');
        } else {
          this.frontButtons[i].classList.remove('active');
        }
      }
      this.parent.frontLightsChanged(_index + 1);
    }
  };
  CardControls.prototype.closeXClick = function (ev) {
    this.parent.exitSection();
  };
  return CardControls;
}();
const _default = CardControls;
export { _default as default };