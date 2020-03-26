import { convexHull } from './convex_hull.js'


export default class ConvexApp {
  constructor(stage) {
    this.stage = stage
    this.pointsScene = new THREE.Group()
    // 任意的点
    let points = []
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(1, 4, 0));
    points.push(new THREE.Vector3(3, 1, 0));
    points.push(new THREE.Vector3(3, 3, 0));
    points.push(new THREE.Vector3(5, 2, 0));
    points.push(new THREE.Vector3(7, 0, 0));
    points.push(new THREE.Vector3(9, 6, 0));

    this.addAllPoint(points)

    // 转化为凸包的点
    let convexHullPoints = null
    // 通过 Jarvis’s Algorithm
    convexHullPoints = convexHull(points)

    // 增加一个起点,使其成为闭合的多边形
    convexHullPoints.push(convexHullPoints[0])
    this.drawLineToScene(convexHullPoints)
    this.updataColor(convexHullPoints)
  }

  addAllPoint(points) {
    points.forEach(item => {
      var geometry = new THREE.SphereGeometry(0.2, 64, 64);
      var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      var sphere = new THREE.Mesh(geometry, material);
      this.pointsScene.add(sphere)
      sphere.position.set(item.x, item.y, item.z)
      this.addText(`(${item.x},${item.y})`, { x: item.x, y: item.y, z: item.z }, 0xffffff)
    });
    this.stage.scene.add(this.pointsScene);
  }

  drawLineToScene(points) {
    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var line = new THREE.Line(geometry, material);
    this.stage.scene.add(line);
  }

  addText(text, position, color) {
    // load font
    var loader = new THREE.FontLoader();
    loader.load('./lib/optimer_bold.typeface.json', (font) => {
      var mat = new THREE.MeshBasicMaterial({
        color,
      });
      let geo = new THREE.TextGeometry(text, { size: 0.4, height: 0.1, font })
      var mesh = new THREE.Mesh(geo, mat)
      // mesh.scale.z = 0.1
      mesh.position.set(position.x + 0.3, position.y, position.z)
      // mesh.rotation.set(0, 1.52, 0)
      this.stage.scene.add(mesh)
    })
  }

  // 将凸包的极点标记成新的颜色
  updataColor(position) {
    for (let i = 0; i < position.length; i++) {
      this.pointsScene.children.forEach(item => {
        if (position[i].equals(item.position)) {
          item.material.color.set(0x00ffff)
        }
      });
    }
  }
}
