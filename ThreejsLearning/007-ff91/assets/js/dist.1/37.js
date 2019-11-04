var Pulsegrid_1 = require('./34');
var utils_1 = require('./0');
var ViewPreload = function () {
  function ViewPreload(_scene, _renderer, _cam, _vp) {
    this.sceneWGL = _scene;
    this.rendererWGL = _renderer;
    this.cam = _cam;
    this.vp = _vp;
    this.prog = 0;
    this.progTarget = 1;
    this.mouse = new THREE.Vector2();
    this.grid = new Pulsegrid_1.default(this.sceneWGL);
  }
  ViewPreload.prototype.onMouseMove = function (event) {
    this.mouse.x = utils_1.normalize(event.clientX, 0, this.vp.x);
    this.mouse.y = utils_1.normalize(event.clientY, 0, this.vp.y);
    this.grid.onMouseMove(this.mouse.x, this.mouse.y);
  };
  ViewPreload.prototype.onWindowResize = function (_vp) {
    this.vp.copy(_vp);
    this.grid.onWindowResize(this.vp.x, this.vp.y);
  };
  ViewPreload.prototype.exitAnimation = function (_callback) {
    TweenLite.to(this, 2, {
      progTarget: -0.2,
      ease: Power2.easeInOut,
      onComplete: function () {
        this.sceneWGL.children = [];
        _callback();
      }.bind(this)
    });
  };
  ViewPreload.prototype.update = function (_time) {
    this.prog = utils_1.zTween(this.prog, this.progTarget, _time * 0.01);
    this.grid.update(_time, this.prog);
    this.cam.update();
    this.rendererWGL.render(this.sceneWGL, this.cam.camera);
    return true;
  };
  return ViewPreload;
}();
exports.default = ViewPreload;