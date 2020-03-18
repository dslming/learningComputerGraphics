import * as THREE from './lib/three.module.js'
import HotPoint from './HotPoint.js'

const camTip1 = (camCtl) => {
  camCtl.setPosition(25, 25, 25, true)
}

const camTip2 = (camCtl) => {
  camCtl.setPosition(-18, 0, 35, true)
}

const camTip3 = (camCtl) => {
  camCtl.setPosition(0, 0, 35, true)
}

const camObj = {
  1: { fn: camTip1 },
  2: { fn: camTip2 },
  3: { fn: camTip3 },
}

export default class Box {
  constructor(stage, camCtl) {
    this.stage = stage
    // stage.camera.position.set(0, 10, 30)
    // camCtl.moveTo(0, 8, 50, false)
    camCtl.setPosition(0, 0, 70, false)
    const size = 10
    const box = this._addBox(size)
    stage.scene.add(box);
    stage.onUpdate(() => {
      this.updateScreenPosition()
    })

    this.hotPoints = []
    let hotPoint1 = new HotPoint(stage, 1, { x: size / 2, y: size / 2, z: size / 2 + 1 })
    let hotPoint2 = new HotPoint(stage, 2, { x: -size / 2, y: 0, z: size / 2 + 1 })
    let hotPoint3 = new HotPoint(stage, 3, { x: 0, y: 0, z: size / 2 + 1 })
    this.hotPoints.push(hotPoint1)
    this.hotPoints.push(hotPoint2)
    this.hotPoints.push(hotPoint3)
    this.initRay()
    this.camCtl = camCtl
    camCtl.setTarget(box.position.x, box.position.y, box.position.z, true)

    camCtl.dolly(10, true)
    camCtl.rotate(0, -25 * THREE.Math.DEG2RAD, true)
    camCtl.rotate(25 * THREE.Math.DEG2RAD, 0, true)
    setTimeout(() => {
      hotPoint3.click = true
      camTip3(camCtl)
    }, 500);
  }

  _addBox(size) {
    var geometry = new THREE.BoxGeometry(size, size, size);
    var material = new THREE.MeshPhongMaterial({
      color: 0x63e42a,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    })
    var cube = new THREE.Mesh(geometry, material);
    return cube
  }

  updateScreenPosition() {
    this.hotPoints.forEach(hot => {
      const name = hot.name
      this.setTip(`.tip${name}`, hot.click, hot.sprite.position)
    });
  }

  setTip(name, isShow, position) {
    const annotation = document.querySelector(name);
    const vector = new THREE.Vector3(position.x + 1, position.y + 1, position.z);
    const canvas = this.stage.renderer.domElement;

    vector.project(this.stage.camera);

    vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
    vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

    annotation.style.top = `${vector.y}px`;
    annotation.style.left = `${vector.x}px`;
    annotation.style.opacity = isShow ? 1 : 0;
    annotation.style.zIndex = isShow ? 1 : -1;
  }

  initRay() {
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let that = this
    const objs = that.hotPoints.map(item => { return item.sprite })

    function onMouseClick(event) {
      let clientX = 0
      let clientY = 0

      if (event.targetTouches) {
        // 移动端点击事件
        clientX = event.targetTouches[0].clientX
        clientY = event.targetTouches[0].clientY
      } else {
        // PC 点击事件
        clientX = event.clientX
        clientY = event.clientY
      }

      //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      mouse.x = (clientX / that.stage.renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = - (clientY / that.stage.renderer.domElement.clientHeight) * 2 + 1;

      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera(mouse, that.stage.camera);
      var intersects = raycaster.intersectObjects(objs);

      let name = null
      if (intersects.length > 0) {
        name = intersects[0].object.name
        // that.hotPoints[name - 1].click = true
        camObj[name].fn(that.camCtl)
      } else {
        name = null
      }
      if (name != null) {
        that.hotPoints.forEach(item => {
          if (item.name == name) {
            item.click = !item.click
          } else {
            item.click = false
          }
        });
      } else {
        that.hotPoints.forEach(item => {
          item.click = false
        });
      }
    }

    function onMouseMove(event) {
      let clientX = 0
      let clientY = 0

      // PC 点击事件
      clientX = event.clientX
      clientY = event.clientY

      //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      mouse.x = (clientX / that.stage.renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = - (clientY / that.stage.renderer.domElement.clientHeight) * 2 + 1;

      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera(mouse, that.stage.camera);
      var intersects = raycaster.intersectObjects(objs);
      if (intersects.length > 0) {
        let name = intersects[0].object.name
        that.hotPoints[name - 1].changeColor(true)
      } else {
        that.hotPoints.forEach(item => {
          item.changeColor(false)
        });
      }
    }
    let canvas = that.stage.renderer.domElement;
    canvas.addEventListener('click', onMouseClick);
    canvas.addEventListener('touchstart', onMouseClick);
    // canvas.addEventListener('mousemove', onMouseMove);
  }
}
