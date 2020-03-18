import * as THREE from './lib/three.module.js'
import CameraControls from './lib/camera-controls.module.js'

CameraControls.install({ THREE: THREE });

export default class Camera {
  constructor(stage) {
    const clock = new THREE.Clock();
    this.ctl = new CameraControls(stage.camera, stage.renderer.domElement);
    // 阻尼
    this.ctl.dampingFactor = 0.1
    stage.onUpdate(() => {
      const delta = clock.getDelta();
      const hasControlsUpdated = this.ctl.update(delta);
      if (hasControlsUpdated) {
        stage.renderer.render(stage.scene, stage.camera);
      }
    })
  }
}
