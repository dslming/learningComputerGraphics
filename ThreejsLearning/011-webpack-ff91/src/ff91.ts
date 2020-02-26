
import Camera from './Camera'
import ViewTour from './ViewTour'
import AssetLoader from './AssetLoader'
import CameraDebug from './CameraDebug'
const THREE = (window as any).THREE
const Hammer = (window as any).Hammer

export class Control {
  vp: any;
  cam: any
  sceneWGL: any
  container: any
  viewTour!: ViewTour
  rendererWGL: any
  assetLoader: AssetLoader
  disableRender: boolean
  hammer: any;
  disableHammer!: boolean;
  cardControls: any;
  mousePrev: any = new THREE.Vector2();
  gA: any;
  zoom: any;
  mouseMoveRef: any;
  onMouseMove: any;
  firstZoomRef: any
  cameraDebug: any

  constructor() {
    this.disableRender = false
    // 场景
    this.sceneWGL = new THREE.Scene()
    this.sceneWGL.name = 'sceneWGL'

    // 渲染
    this.vp = new THREE.Vector2(window.innerWidth, window.innerHeight)
    this.rendererWGL = new THREE.WebGLRenderer({ antialias: true });
    this.rendererWGL.setPixelRatio(window.devicePixelRatio);
    this.rendererWGL.setSize(this.vp.x, this.vp.y);
    this.rendererWGL.autoClear = false
    this.rendererWGL.autoUpdate = false
    this.rendererWGL.autoClearStencil = false
    this.container = document.getElementById("GLCanvas")
    this.container.appendChild(this.rendererWGL.domElement);

    // 相机
    let camOptions = {
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
    }
    this.cam = new Camera(camOptions)
    this.cam.rotTarget.x = THREE.Math.randFloatSpread(30);
    this.cam.rotTarget.y = THREE.Math.randFloatSpread(30);
    this.sceneWGL.add(this.cam.camera)
    // 资源加载
    let manifesto = [
      // Cube textures
      { name: "envReflection", type: "cubetexture", ext: "jpg" },
      { name: "envSkybox", type: "cubetexture", ext: "jpg" },
      // Car lights
      { name: "flareHead", type: "texture", ext: "jpg" },
      { name: "flareTurn", type: "texture", ext: "jpg" },
      { name: "lightTurn", type: "texture", ext: "jpg" },
      { name: "lightStop", type: "texture", ext: "jpg" },
      // Car geometry
      { name: "body", type: "mesh", ext: "json" },
      { name: "wheel", type: "mesh", ext: "json" },
      { name: "xrays", type: "mesh", ext: "json" },
      // Car textures
      { name: "thread", type: "texture", ext: "jpg" },
      { name: "shadow", type: "texture", ext: "jpg" },
      { name: "led", type: "texture", ext: "png" },
    ];
    this.assetLoader = new AssetLoader("./static/", manifesto, () => {
      // console.error('load over...')
      this.viewTour = new ViewTour(this.sceneWGL, this.rendererWGL, this.cam, this.vp);
      this.viewTour.initMeshes(this.assetLoader.cargo);
      this.disableRender = true
      window.addEventListener('wheel', this.firstZoomRef, false);
      window.addEventListener('wheel', this.gestureWheel.bind(this), false);
      this.initHammer()
      this.hammer.on('pinch', this.firstZoomRef);

      // 相机调试
      // this.cameraDebug = new CameraDebug(this.cam.camera, this.sceneWGL, this.rendererWGL, this.vp.x, this.vp.y)
    })
    this.assetLoader.start()
    this.firstZoomRef = this.hammerFirstZoom.bind(this);
  }
  update(t: any) {
    this.disableRender && (this.viewTour.update(t))
    // this.cameraDebug && this.cameraDebug.run()
  }

  initHammer() {
    this.hammer = new Hammer(document.getElementById('CSSCanvas'));
    this.hammer.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
      threshold: 1
    });
    this.hammer.get('pinch').set({ enable: true });
    this.hammer.on('pan', this.hammerPan.bind(this));
    // this.hammer.on('pan', this.hammerFirstPan.bind(this));
    this.hammer.on('panstart', this.hammerPanStart.bind(this));
    this.hammer.on('panend', this.hammerPanEnd.bind(this));
    this.hammer.on('pinch', this.hammerPinch.bind(this));
    this.hammer.on('pinchstart', this.hammerPinchStart.bind(this));
  }

  // 鼠标每次移动的坐标
  hammerPan(event: { center: { x: number; y: number; }; }) {
    if (!this.disableHammer) {
      let angleX = (event.center.x - this.mousePrev.x) / this.vp.x * 80
      let angleY = (event.center.y - this.mousePrev.y) / this.vp.y * 80
      this.cam.orbitBy(angleX, angleY);

      // 记录这次的坐标位置
      this.mousePrev.set(event.center.x, event.center.y);
    }
    else {
      // this.cardControls.knobMoved(event.center.x - this.mousePrev.x, event.center.y - this.mousePrev.y);
    }
  }

  hammerPanStart(event: { center: { x: any; y: any; }; }) {
    this.mousePrev.set(event.center.x, event.center.y);
  }

  hammerPanEnd(event: any) {
    this.disableHammer = false;
    // this.cardControls.knobReleased();
  }

  hammerPinchStart(event: any) {
    this.zoom = this.cam.getDistance();
    console.error(event)
  }
  hammerPinch(event: { scale: number; }) {
    this.cam.setDistance(this.zoom / event.scale);
    console.error(event, 'hammerPinch')
  }

  hammerFirstZoom(event: any) {
    // console.error(event, 'hammerFirstZoom')
    // this.gA.uiEvent('vehicle-zoom', '3DTour');
    this.hammer.off('pinch', this.firstZoomRef);
    window.removeEventListener('wheel', this.firstZoomRef, false);
  }

  hammerFirstPan(event: any) {
    // this.gA.uiEvent('vehicle-move', '3DTour');
    // this.hammer.off('pan', this.hammerFirstPan.bind(this));
  }

  gestureWheel(event: any) {
    console.error('gestureWheel')
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
  }
}
