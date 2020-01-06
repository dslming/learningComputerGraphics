import { Stage } from './Stage.js'
import { ScanLine } from './ScanLine.js'

// 已知多边形是一个矩形的4个顶点,先在场景中绘制出来
function drawRectPoint(scene, points) {
  let pointsMaterial = new THREE.PointsMaterial({ color: 0x0000ff, size: 2 });

  points.forEach(ele => {
    let pointsGeometry = new THREE.Geometry();
    let vector = new THREE.Vector3(ele.x, ele.y, 0)
    pointsGeometry.vertices.push(vector);
    let point = new THREE.Points(pointsGeometry, pointsMaterial);
    point.name = "point"
    scene.add(point);
  });
}

class App {
  constructor() {
    let stage = new Stage()
    let mp = new ScanLine()

    // let polyPoints = [
    //   {
    //     x: 0,
    //     y: 0,
    //   },
    //   {
    //     x: 0,
    //     y: 5,
    //   },
    //   {
    //     x: 5,
    //     y: 5,
    //   },
    //   {
    //     x: 5,
    //     y: 0,
    //   }
    // ]

    let polyPoints = [
      {
        x: 0,
        y: 0,
      },
      {
        x: 20,
        y: 0,
      },
      {
        x: 20,
        y: 10,
      },
      {
        x: 10,
        y: 20,
      },
      // {
      //   x: 11,
      //   y: 13,
      // },
      // {
      //   x: 13,
      //   y: 7,
      // }
    ]

    // let polyPoints = [
    //   {
    //     x: 2,
    //     y: 2,
    //   },
    //   {
    //     x: 5,
    //     y: 1,
    //   },
    //   {
    //     x: 11,
    //     y: 3,
    //   },
    //   {
    //     x: 11,
    //     y: 8,
    //   },
    //   {
    //     x: 5,
    //     y: 5,
    //   },
    //   {
    //     x: 2,
    //     y: 7,
    //   }
    // ]


    drawRectPoint(stage.scene, polyPoints)
    let p = mp.polyfill(polyPoints)
    console.error(p);

    p.forEach(point => {
      stage.drawPoints(point)
    });

    stage.run()
  }
}

new App()
