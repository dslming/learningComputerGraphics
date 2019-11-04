let CAMERA_VIEW_WIDTH = 480 / 480 * 500;
let CAMERA_VIEW_HEIGHT = 320 / 480 * 500;
const THREE = (window as any).THREE

export default class CameraDebug {
    time: number;
    renderer: any;
    userCameraHelp: any;
    userCamera: any
    debugCamera: any;
    scene: any;

    constructor(userCamera:any, scene:any, renderer:any, vw:any, vh:any) {
        this.time = 0
        this.renderer = renderer
        this.scene = scene
        this.userCamera = userCamera

        // 给userCamera 加 help
        this.userCameraHelp = new THREE.CameraHelper(userCamera)
        this.userCameraHelp.name = 'userCameraHelp'
        scene.add(this.userCameraHelp)

        // 配置调试相机
        this.debugCamera = new THREE.PerspectiveCamera(30, CAMERA_VIEW_WIDTH / CAMERA_VIEW_HEIGHT, 1, 500)
        this.debugCamera.name = 'debugCamera'
        scene.add(this.debugCamera)
    }

    update(dt:any) {
        this.time += dt;
        let AROUND_VECTOR = new THREE.Vector3(0, 30, 30)
        this.debugCamera.position.copy(AROUND_VECTOR)
        this.debugCamera.lookAt(0, 0, 0)
    }

    draw() {
        this.renderer.clear();
        this.userCameraHelp.update();
        
        // user渲染器。setScissor （left ，positiveYUpBottom ，width ，height ）;
        this.renderer.setScissor(0, CAMERA_VIEW_HEIGHT, CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT);
        this.renderer.setViewport(0, CAMERA_VIEW_HEIGHT, CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT);
        this.renderer.render(this.scene, this.userCamera);

        // debug
        this.renderer.setScissor(0, 0, CAMERA_VIEW_WIDTH,　 CAMERA_VIEW_HEIGHT)
        this.renderer.setViewport(0, 0, CAMERA_VIEW_WIDTH,　 CAMERA_VIEW_HEIGHT)
        this.renderer.render(this.scene, this.debugCamera)

    }

    run() {
        this.update(1/60)
        this.draw()
    }
}