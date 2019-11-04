var viewTour_1 = require('./38');
var viewPreload_1 = require('./37');
var nav_1 = require('./32');
var CardControls_1 = require('./31');
var assetLoader_1 = require('./40');
var Monoc_1 = require('./42');
var analytics_1 = require('./39');
var CardProps = require('./2');
lm.CardProps = CardProps

export class Controls{
  constructor(){
    this.devMode = false;
    this.zoom = 1;
    this.disableHammer = false;
    this.disableRender = false;
    this.gAActive = -1;
    this.gAKnob = false;
    this.gA = new analytics_1.default('UA-63053901-2');
    this.analytics = this.gA
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
    lm.monoc = this.cam
    this.cam.rotTarget.x = THREE.Math.randFloatSpread(30);
    this.cam.rotTarget.y = THREE.Math.randFloatSpread(30);
    this.viewPreload = new viewPreload_1.default(this.sceneWGL, this.rendererWGL, this.cam, this.vp);
    lm.viewPreload= this.viewPreload
    this.viewActive = this.viewPreload;
    this.mousePrev = new THREE.Vector2();
    this.cardControls = new CardControls_1.default(this);
    lm.cardControls = this.cardControls
    this.mouseMoveRef = this.onMouseMove.bind(this);
    this.firstZoomRef = this.hammerFirstZoom.bind(this);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    window.addEventListener('wheel', this.gestureWheel.bind(this), false);
    window.addEventListener('mousemove', this.mouseMoveRef, false);
    this.initPreloader();
    this.initHammer();
  }
  initHammer() {
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
  initPreloader() {
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
    this.assetLoader = this.assetLoader
    this.assetLoader.start();
  };
  preloadComplete(_cargo) {
    this.gA.uiEvent('click-begin', '3DTour');
    window.removeEventListener('mousemove', this.mouseMoveRef, false);
    this.viewPreload.exitAnimation(this.initTourView.bind(this));
  };
  initTourView() {
    this.gA.pageView(CardProps.Desktop[7].name);
    this.backBtn.classList.remove('inverted');
    this.nav = new nav_1.default(this);
    lm.nav = this.nav
    this.viewTour = new viewTour_1.default(this.sceneWGL, this.rendererWGL, this.cam, this.vp);
    lm.viewTour = this.viewTour
    this.viewActive = this.viewTour;
    this.viewActive.initMeshes(this.assetLoader.cargo);
    this.viewPreload = null;
    window.addEventListener('wheel', this.firstZoomRef, false);
    this.hammer.on('pinch', this.firstZoomRef);
  };
  hammerPan(event) {
    if (!this.disableHammer) {
      this.cam.orbitBy((event.center.x - this.mousePrev.x) / this.vp.x * 90, (event.center.y - this.mousePrev.y) / this.vp.y * 90);
      this.mousePrev.set(event.center.x, event.center.y);
    } else {
      this.cardControls.knobMoved(event.center.x - this.mousePrev.x, event.center.y - this.mousePrev.y);
    }
  };
  hammerPanEnd(event) {
    this.disableHammer = false;
    this.cardControls.knobReleased();
  };
  hammerPinchStart(event) {
    this.zoom = this.cam.getDistance();
  };
  hammerPinch(event) {
    this.cam.setDistance(this.zoom / event.scale);
  };
  hammerPanStart(event) {
    this.mousePrev.set(event.center.x, event.center.y);
  };
  hammerFirstZoom(event) {
    this.gA.uiEvent('vehicle-zoom', '3DTour');
    this.hammer.off('pinch', this.firstZoomRef);
    window.removeEventListener('wheel', this.firstZoomRef, false);
  };
  hammerFirstPan(event) {
    this.gA.uiEvent('vehicle-move', '3DTour');
    this.hammer.off('pan', this.hammerFirstPan.bind(this));
  };
  navClicked(_index) {
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
  backToFF() {
    this.outboundGA('back to ff');
    if (window['language'] === 'us') {
      window.location.href = 'https://www.ff.com/';
    } else {
      window.location.href = 'https://www.ff.com/cn/';
    }
  };
  outboundGA(label) {
    this.gA.uiEvent(label);
  };
  mobileNavOpened() {
    this.disableRender = true;
  };
  mobileNavClosed() {
    this.disableRender = false;
  };
  knobMouseDown() {
    this.disableHammer = true;
  };
  knobMouseMoved(_knobPos) {
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
  knobMouseUp() {
    this.disableHammer = false;
  };
  frontLightsChanged(_index) {
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
  exitSection() {
    this.nav.navClick(7, null);
  };
  gestureWheel(event) {
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
  onMouseMove(_ev) {
    this.viewPreload.onMouseMove(_ev);
  };
  onWindowResize() {
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
  update(t) {
    if (!this.disableRender && this.viewActive.update(t) && this.devMode) {
      this.stats.update();
    }
  };
}