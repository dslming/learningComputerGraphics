import Stage from './Stage.js'
import Plane from './Plane.js'

let that = null

class App {
  constructor() {
    that = this
    let img = new Image()
    img.src = "./last.jpg"
    img.onload = () => {
      this.stage = new Stage("#app");
      const plane = new Plane({
        img,
        width: 400,
        height: 300
      }, this.stage);
      window.lm = plane
      this.loop()
    }
  }

  loop() {
    that.stage.render();
    requestAnimationFrame(that.loop)
  }
}

window.onload = () => {
  new App()
}
