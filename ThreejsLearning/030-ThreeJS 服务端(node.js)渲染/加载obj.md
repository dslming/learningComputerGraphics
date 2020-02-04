### 加载obj文件

关键步骤:
```js
  let pingObj = await readFile("./module/ping.obj")
  let loaderObj = new THREE.OBJLoader()
  // 将字符串转化为数组
  let objStr = Uint8ArrayToString(Uint8Array.from(pingObj))
  let obj = loaderObj.parse(objStr)
```

完整代码:
```js
const THREE = require("three");
const SoftwareRenderer = require("three-software-renderer");
const PNG = require("pngjs").PNG;
const fs = require("fs");
const MTLLoader = require('three-mtl-loader');
var OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

const width = 1024;
const height = 768;

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function (err, data) {
      if (err) {
        console.log(err);
        reject(err)
      } else {
        resolve(data)
        // cb(data)
      }
    })
  })
}


function Uint8ArrayToString(fileData) {
  var dataString = "";
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString
}

function generalPicture(scene, camera) {
  const renderer = new SoftwareRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  var imagedata = renderer.render(scene, camera);

  // Create a PNG from the pixels array (RGBA)
  const png = new PNG({
    width: width,
    height: height,
    filterType: -1
  });

  for (var i = 0; i < imagedata.data.length; i++) {
    png.data[i] = imagedata.data[i];
  }
  console.log(png.data);
  if (!fs.existsSync("mergeOver")) {
    fs.mkdirSync("mergeOver");
  }
  png.pack().pipe(fs.createWriteStream("mergeOver/example.png"));
}

function initScene({ pingImg, pingMtl, pingObj }) {
  if (!pingImg || !pingMtl || !pingObj) {
    console.error("文件错误");
    return
  }

  const width = 1024;
  const height = 768;
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
  camera.position.z = 15;
  const scene = new THREE.Scene();

  // 环境光
  var ambient = new THREE.AmbientLight(0xffffff, 1);
  ambient.name = "ambient";
  scene.add(ambient);

  console.error(pingImg.width, pingImg.height);

  const tex = new THREE.DataTexture(
    Uint8Array.from(pingImg.data),
    pingImg.width,
    pingImg.height,
    THREE.RGBAFormat,
    THREE.UnsignedByteType,
    THREE.UVMapping
  )
  tex.needsUpdate = true

  let loaderObj = new THREE.OBJLoader()
  let loaderMtl = new MTLLoader()
  let objStr = Uint8ArrayToString(Uint8Array.from(pingObj))
  let mtlStr = Uint8ArrayToString(Uint8Array.from(pingMtl))
  let mtl = loaderMtl.parse(mtlStr)
  loaderObj.setMaterials(mtl);
  let obj = loaderObj.parse(objStr)
  obj.children.forEach(item => {
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff
    });
    item.material = material;
  });
  obj.children[2].material.map = tex
  obj.children[2].material.needsUpdate = true
  scene.add(obj)

  generalPicture(scene, camera)
}

async function run() {
  let pingObj = null
  try {
    pingObj = await readFile("./module/ping.obj")
  } catch (error) {
    console.error(error);
    console.error("获取 pingObj 文件失败...");
    return
  }
  console.error("read ping.obj ok...");

  let pingMtl = null
  try {
    pingMtl = await readFile("./module/ping.mtl")
  } catch (error) {
    console.error(error);
    console.error("获取 pingMtl 文件失败...");
    return
  }
  console.error("read ping.mtl ok...");

  const pingImg = PNG.sync.read(fs.readFileSync('./module/ping1024.png'))
  console.error("read ping.png ok...");

  initScene({ pingImg, pingMtl, pingObj })
}


run()

```
<全文结束>
