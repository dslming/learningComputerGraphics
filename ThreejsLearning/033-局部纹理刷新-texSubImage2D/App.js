import * as THREE from './lib/three.module.js'
import { Stage } from './Stage.js'
import UpdatableTexture from './UpdatableTexture.js'

function fade(texture) {
  const width = 512
  const height = 512
  const s = 32
  var color = `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)})`;
  for (var y = 0; y < height; y += s) {
    for (var x = 0; x < width; x += s) {
      (function (x, y) {
        function generate() {
          var canvas = document.createElement('canvas');
          canvas.width = canvas.height = s;
          var ctx = canvas.getContext('2d');

          ctx.fillStyle = color;
          ctx.fillRect(0, 0, s, s);

          ctx.globalAlpha = .5;

          ctx.strokeStyle = '#000000'
          ctx.beginPath();
          ctx.moveTo(s, 0);
          ctx.lineTo(s, s);
          ctx.lineTo(0, s);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff'
          ctx.beginPath();
          ctx.moveTo(s, 0);
          ctx.lineTo(0, 0);
          ctx.lineTo(0, s);
          ctx.stroke();

          texture.update(canvas, x, y);
        }
        setTimeout(generate, 1000 * Math.random());
      })(x, y);
    }
  }
  // 每2s更新一次
  setTimeout(() => {
    fade(texture)
  }, 1500);
}

class App {
  constructor() {
    this.stage = new Stage("#app")
    window.lm = this
    this.addBox()
    this.stage.run()
  }

  addBox() {
    var width = 512;
    var height = 512;

    this.texture = new UpdatableTexture();
    this.texture.setRenderer(this.stage.renderer);
    this.texture.minFilter = this.texture.magFilter = THREE.NearestFilter;
    this.texture.generateMipmaps = false;

    const material = new THREE.MeshBasicMaterial({ map: this.texture });
    let geometry = new THREE.BoxGeometry(10, 10, 10)
    let cube = new THREE.Mesh(geometry, material);
    this.stage.scene.add(cube)
    this.stage.renderer.render(this.stage.scene, this.stage.camera);

    this.texture.setSize(width, height);
    fade(this.texture)
    this.stage.onUpdate(() => {
      cube.rotation.y -= 0.005
      cube.rotation.x += 0.005
    })
  }
}

window.onload = () => {
  new App()
}
