import { Road } from './Road.js'
import { CarLights } from './CarLights.js'
import { Stage } from './Stage.js'
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
    this.update.bind(this)
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
    that.clock.getDelta();
    // time: 时钟运行的总时长。
    let time = that.clock.elapsedTime
    console.error(time);

    that.leftLights.update(time);
    that.rightLights.update(time);
  }
}
let a = new App()
window.lm = a

