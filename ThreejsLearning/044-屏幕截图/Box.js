import * as THREE from './lib/three.module.js'

export default class Box {
  constructor(stage, event) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    cube.scale.set(5, 5, 5)
    stage.scene.add(cube);
    this.stage = stage
    stage.onUpdate(() => {
      cube.rotation.y += 0.005;
      cube.rotation.x += 0.005;
    })

    this.onButtonClick = this.onButtonClick.bind(this, this.onButtonClick)
    event.add(this.onButtonClick)
  }

  onButtonClick() {
    var canvas = this.stage.renderer.getContext().canvas;

    // Open a new tab
    let newWindow = window.open('', '');
    newWindow.document.title = "屏幕截图";
    newWindow.document.body.style.margin = "0";

    // Show the image data in a new window/tab.
    var img = new Image();
    img.src = canvas.toDataURL();
    newWindow.document.body.appendChild(img);
  }
}
