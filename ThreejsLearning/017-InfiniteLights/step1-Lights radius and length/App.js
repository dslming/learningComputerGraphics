import { BasicThreeDemo } from "./BasicThreeDemo.js";
import { Road } from "./Road.js";
import { CarLights } from "./CarLights.js";
export class App extends BasicThreeDemo {
  constructor(container, options) {
    super(container);
    // this.camera.position.z = 50;
    // Dp stuff
    this.camera.position.z = -5;
    this.camera.position.y = 7;
    this.camera.position.x = 0;

    this.road = new Road(this, options);
    this.leftLights = new CarLights(this, options);
  }
  loadAssets() {
    return new Promise((resolve, reject) => {
      const manager = new THREE.LoadingManager(resolve);

      manager.itemStart("test");
      manager.itemEnd("test");
    });
  }
  init() {
    // this.scene.add(mesh);

    this.road.init();
    this.leftLights.init();

    this.tick();
  }
  update(delta) { }
  dispose() { }
}
