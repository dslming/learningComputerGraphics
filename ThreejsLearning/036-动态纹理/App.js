import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import TextureAnimator from './TextureAnimator.js'

class App {
  constructor() {
    this.stage = new Stage("#app")
    window.lm = this
    this.addRunner()
    this.stage.run()
  }

  addRunner() {
    const clock = new THREE.Clock()
    var runnerTexture = new THREE.ImageUtils.loadTexture('./run.png');
    // texture, #horiz, #vert, #total, duration.
    var annie = new TextureAnimator(runnerTexture, 10, 1, 10, 100);
    var runnerMaterial = new THREE.MeshBasicMaterial({ map: runnerTexture, side: THREE.DoubleSide });
    var runnerGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
    var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
    runner.position.set(0, 0, -100);
    this.stage.scene.add(runner)
    this.stage.onUpdate(() => {
      var delta = clock.getDelta()
      annie.update(1000 * delta);
    })
  }
}

window.onload = () => {
  new App()
}
