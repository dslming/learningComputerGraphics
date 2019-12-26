import { Road } from './Road.js'
import { CarLights } from './CarLights.js'
import { Stage } from './Stage.js'

function lerp(current, target, speed = 0.1, limit = 0.001) {
  let change = (target - current) * speed;
  if (Math.abs(change) < limit) {
    change = target - current;
  }
  return change;
}

let that = null
class App {
  constructor() {
    const options = {
      length: 400,
      width: 20,
      roadWidth: 9,
      islandWidth: 2,
      nPairs: 50,
      roadSections: 3
    };
    that = this
    this.update = this.update.bind(this)
    this.fovTarget = 90;
    this.speedUpTarget = 0;
    this.speedUp = 0;
    this.timeOffset = 0;

    this.clock = new THREE.Clock();
    this.stage = new Stage("#app")
    this.road = new Road(this.stage, options);
    this.leftLights = new CarLights(this.stage, options, 0xff102a, 60);
    this.rightLights = new CarLights(this.stage, options, 0xfafafa, -60);

    this.road.init()

    this.leftLights.init()
    this.leftLights.mesh.position.setX(
      -options.roadWidth / 2 - options.islandWidth / 2
    );

    this.rightLights.init();
    this.rightLights.mesh.position.setX(
      options.roadWidth / 2 + options.islandWidth / 2
    );

    this.stage.run(this.update)
  }

  update() {
    let delta = that.clock.getDelta();

    let coefficient = -60 * Math.log2(1 - 0.1);
    let lerpT = Math.exp(-coefficient * delta);
    this.speedUp += lerp(
      this.speedUp,
      this.speedUpTarget,
      // 10% each frame
      lerpT,
      0.00001
    );
    // Also frame-dependent
    this.timeOffset += this.speedUp * delta;

    let time = this.clock.elapsedTime + this.timeOffset;
    this.leftLights.update(time);
    this.rightLights.update(time);

    let fovChange = lerp(this.stage.camera.fov, this.fovTarget, lerpT);
    if (fovChange !== 0) {
      this.stage.camera.fov += fovChange * delta * 6;
      this.stage.camera.updateProjectionMatrix();
    }
  }
}
let a = new App()
window.lm = a

