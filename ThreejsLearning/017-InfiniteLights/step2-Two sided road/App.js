import { Road } from './Road.js'
import { CarLights } from './CarLights.js'
import { Stage } from './Stage.js'

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
    this.stage = new Stage("#app")
    this.road = new Road(this.stage, options);
    this.leftLights = new CarLights(this.stage, options, 0xff102a);
    this.rightLights = new CarLights(this.stage, options, 0xfafafa);

    this.road.init()
    this.leftLights.init()
    this.rightLights.init()
    this.stage.run()
  }
}

new App()
