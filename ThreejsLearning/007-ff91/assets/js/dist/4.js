'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var viewTour_1 = require('./38');
var viewPreload_1 = require('./37');
var nav_1 = require('./32');
var CardControls_1 = require('./31');
var assetLoader_1 = require('./40');
var Monoc_1 = require('./42');
var analytics_1 = require('./39');
var CardProps = require('./2');
var Controls = function () {
  function Controls() {
    this.devMode = false;
    this.zoom = 1;
    this.disableHammer = false;
    this.disableRender = false;
    this.gAActive = -1;
    this.gAKnob = false;
    this.gA = new analytics_1.default('UA-63053901-2');
    this.vp = new THREE.Vector2(window.innerWidth, window.innerHeight);
    this.sceneWGL = new THREE.Scene();
    this.sceneWGL.background = new THREE.Color(0);
    this.rendererWGL = new THREE.WebGLRenderer({ antialias: true });
    this.rendererWGL.setSize(this.vp.x, this.vp.y);
    if (this.devMode) {
      this.stats = new Stats();
      this.stats.showPanel(1);
      document.body.appendChild(this.stats.dom);
    }
    document.getElementById('GLCanvas').appendChild(this.rendererWGL.domElement);
    this.backBtn = document.getElementById('backBtn');
    this.backBtn.addEventListener('click', this.backToFF.bind(this), false);
    var camOptions = {
      distance: this.vp.y > 550 ? 8 : 6,
      rotRange: {
        xMin: -30,
        xMax: 30,
        yMin: -30,
        yMax: 30
      },
      distRange: {
        max: 20,
        min: 3
      }
    };
    this.cam = new Monoc_1.default(camOptions);
    this.cam.rotTarget.x = THREE.Math.randFloatSpread(30);
    this.cam.rotTarget.y = THREE.Math.randFloatSpread(30);
    this.viewPreload = new viewPreload_1.default(this.sceneWGL, this.rendererWGL, this.cam, this.vp);
    this.viewActive = this.viewPreload;
    this.mousePrev = new THREE.Vector2();
    this.cardControls = new CardControls_1.default(this);
    this.mouseMoveRef = this.onMouseMove.bind(this);
    this.firstZoomRef = this.hammerFirstZoom.bind(this);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    window.addEventListener('wheel', this.gestureWheel.bind(this), false);
    window.addEventListener('mousemove', this.mouseMoveRef, false);
    this.initPreloader();
    this.initHammer();
  }
  Controls.prototype.initHammer = function () {
    this.hammer = new Hammer(document.getElementById('CSSCanvas'));
    this.hammer.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: 1
    });
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.on('pan', this.hammerPan.bind(this));
    this.hammer.on('pan', this.hammerFirstPan.bind(this));
    this.hammer.on('panstart', this.hammerPanStart.bind(this));
    this.hammer.on('panend', this.hammerPanEnd.bind(this));
    this.hammer.on('pinch', this.hammerPinch.bind(this));
    this.hammer.on('pinchstart', this.hammerPinchStart.bind(this));
  };
  Controls.prototype.initPreloader = function () {
    var manifesto = [
      {
        name: 'envReflection',
        type: 'cubetexture',
        ext: 'jpg'
      },
      {
        name: 'envSkybox',
        type: 'cubetexture',
        ext: 'jpg'
      },
      {
        name: 'flareHead',
        type: 'texture',
        ext: 'jpg'
      },
      {
        name: 'flareTurn',
        type: 'texture',
        ext: 'jpg'
      },
      {
        name: 'lightTurn',
        type: 'texture',
        ext: 'jpg'
      },
      {
        name: 'lightStop',
        type: 'texture',
        ext: 'jpg'
      },
      {
        name: 'body',
        type: 'mesh',
        ext: 'json'
      },
      {
        name: 'wheel',
        type: 'mesh',
        ext: 'json'
      },
      {
        name: 'xrays',
        type: 'mesh',
        ext: 'json'
      },
      {
        name: 'thread',
        type: 'texture',
        ext: 'jpg'
      },
      {
        name: 'shadow',
        type: 'texture',
        ext: 'jpg'
      },
      {
        name: 'led',
        type: 'texture',
        ext: 'png'
      }
    ];
    var path = '../assets/';
    this.assetLoader = new assetLoader_1.AssetLoader(path, manifesto, this.preloadComplete.bind(this));
    this.assetLoader.start();
  };
  Controls.prototype.preloadComplete = function (_cargo) {
    this.gA.uiEvent('click-begin', '3DTour');
    window.removeEventListener('mousemove', this.mouseMoveRef, false);
    this.viewPreload.exitAnimation(this.initTourView.bind(this));
  };
  Controls.prototype.initTourView = function () {
    this.gA.pageView(CardProps.Desktop[7].name);
    this.backBtn.classList.remove('inverted');
    this.nav = new nav_1.default(this);
    this.viewTour = new viewTour_1.default(this.sceneWGL, this.rendererWGL, this.cam, this.vp);
    this.viewActive = this.viewTour;
    this.viewActive.initMeshes(this.assetLoader.cargo);
    this.viewPreload = null;
    window.addEventListener('wheel', this.firstZoomRef, false);
    this.hammer.on('pinch', this.firstZoomRef);
  };
  Controls.prototype.hammerPan = function (event) {
    if (!this.disableHammer) {
      this.cam.orbitBy((event.center.x - this.mousePrev.x) / this.vp.x * 90, (event.center.y - this.mousePrev.y) / this.vp.y * 90);
      this.mousePrev.set(event.center.x, event.center.y);
    } else {
      this.cardControls.knobMoved(event.center.x - this.mousePrev.x, event.center.y - this.mousePrev.y);
    }
  };
  Controls.prototype.hammerPanEnd = function (event) {
    this.disableHammer = false;
    this.cardControls.knobReleased();
  };
  Controls.prototype.hammerPinchStart = function (event) {
    this.zoom = this.cam.getDistance();
  };
  Controls.prototype.hammerPinch = function (event) {
    this.cam.setDistance(this.zoom / event.scale);
  };
  Controls.prototype.hammerPanStart = function (event) {
    this.mousePrev.set(event.center.x, event.center.y);
  };
  Controls.prototype.hammerFirstZoom = function (event) {
    this.gA.uiEvent('vehicle-zoom', '3DTour');
    this.hammer.off('pinch', this.firstZoomRef);
    window.removeEventListener('wheel', this.firstZoomRef, false);
  };
  Controls.prototype.hammerFirstPan = function (event) {
    this.gA.uiEvent('vehicle-move', '3DTour');
    this.hammer.off('pan', this.hammerFirstPan.bind(this));
  };
  Controls.prototype.navClicked = function (_index) {
    this.gAActive = _index;
    this.gA.pageView(CardProps.Desktop[this.gAActive].name);
    this.viewTour.goToSection(_index);
    if (_index === 4 || _index === 5) {
      this.backBtn.classList.add('inverted');
    } else {
      this.backBtn.classList.remove('inverted');
    }
    this.gAKnob = false;
  };
  Controls.prototype.backToFF = function () {
    this.outboundGA('back to ff');
    if (window['language'] === 'us') {
      window.location.href = 'https://www.ff.com/';
    } else {
      window.location.href = 'https://www.ff.com/cn/';
    }
  };
  Controls.prototype.outboundGA = function (label) {
    this.gA.uiEvent(label);
  };
  Controls.prototype.mobileNavOpened = function () {
    this.disableRender = true;
  };
  Controls.prototype.mobileNavClosed = function () {
    this.disableRender = false;
  };
  Controls.prototype.knobMouseDown = function () {
    this.disableHammer = true;
  };
  Controls.prototype.knobMouseMoved = function (_knobPos) {
    this.viewTour.knobMoved(_knobPos);
    if (this.gAKnob === false) {
      var eventName = '';
      switch (this.gAActive) {
      case 2:
        eventName = 'powertrain-interaction';
        break;
      case 3:
        eventName = 'steering-interaction';
        break;
      case 5:
        eventName = 'rear-light-interaction';
        break;
      }
      this.gA.uiEvent(eventName, '3DTour');
      this.gAKnob = true;
    }
  };
  Controls.prototype.knobMouseUp = function () {
    this.disableHammer = false;
  };
  Controls.prototype.frontLightsChanged = function (_index) {
    this.viewTour.frontLightsClicked(_index);
    var eventName = '';
    switch (_index) {
    case 0:
      eventName = 'frontlights-off';
      break;
    case 1:
      eventName = 'frontlights-daytime';
      break;
    case 2:
      eventName = 'frontlights-lowbeams';
      break;
    case 3:
      eventName = 'frontlights-hibeams';
      break;
    case 4:
      eventName = 'frontlights-foglamps';
      break;
    }
    this.gA.uiEvent(eventName, '3DTour');
  };
  Controls.prototype.exitSection = function () {
    this.nav.navClick(7, null);
  };
  Controls.prototype.gestureWheel = function (event) {
    switch (event.deltaMode) {
    case WheelEvent.DOM_DELTA_PIXEL:
      this.cam.dolly(event.deltaY * 0.002);
      break;
    case WheelEvent.DOM_DELTA_LINE:
      this.cam.dolly(event.deltaY * 0.2);
      break;
    case WheelEvent.DOM_DELTA_PAGE:
      this.cam.dolly(event.deltaY * 0.4);
      break;
    }
  };
  Controls.prototype.onMouseMove = function (_ev) {
    this.viewPreload.onMouseMove(_ev);
  };
  Controls.prototype.onWindowResize = function () {
    if (this.disableRender) {
      this.nav.mobileNavHide();
      this.disableRender = false;
    }
    this.vp.x = window.innerWidth;
    this.vp.y = window.innerHeight;
    this.rendererWGL.setSize(this.vp.x, this.vp.y);
    this.cam.onWindowResize(this.vp.x, this.vp.y);
    this.viewActive.onWindowResize(this.vp);
  };
  Controls.prototype.update = function (t) {
    if (!this.disableRender && this.viewActive.update(t) && this.devMode) {
      this.stats.update();
    }
  };
  return Controls;
}();
exports.default = Controls;