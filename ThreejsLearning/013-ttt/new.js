

// import * as THREE from '//techbrood.com/threejs/build/three.module.js';
// import { OrbitControls } from '//techbrood.com/threejs/examples/jsm/controls/OrbitControls.js';
window.OrbitControls = THREE.OrbitControls
const res = {
  uv: './country-index-texture.png',
  countryInfo: country_info,
  texture: "./country-outlines-4k.png"
}
let stageThat = null

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(res.uv, (res) => {
      resolve(res)
    });
  })
}


class GPUPickHelper {
  constructor() {
    // create a 1x1 pixel render target
    this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
    this.pixelBuffer = new Uint8Array(4);
  }
  pick(cssPosition, scene, camera) {
    const { pickingTexture, pixelBuffer } = this;

    // set the view offset to represent just a single pixel under the mouse
    const pixelRatio = renderer.getPixelRatio();
    camera.setViewOffset(
      renderer.getContext().drawingBufferWidth,   // full width
      renderer.getContext().drawingBufferHeight,  // full top
      cssPosition.x * pixelRatio | 0,             // rect x
      cssPosition.y * pixelRatio | 0,             // rect y
      1,                                          // rect width
      1,                                          // rect height
    );
    // render the scene
    renderer.setRenderTarget(pickingTexture);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    // clear the view offset so rendering returns to normal
    camera.clearViewOffset();
    //read the pixel
    renderer.readRenderTargetPixels(
      pickingTexture,
      0,   // x
      0,   // y
      1,   // width
      1,   // height
      pixelBuffer);

    const id =
      (pixelBuffer[0] << 0) |
      (pixelBuffer[1] << 8) |
      (pixelBuffer[2] << 16);

    return id;
  }
}

class Stage {
  constructor() {
    stageThat = this
    this.camera = null
    this.renderer = null
    this.controls = null
    this.scene = null
    this.pickingScene = null

    // 纹理
    this.maxNumCountries = 512;
    this.paletteTextureWidth = this.maxNumCountries
    this.paletteTexture = null
    this.palette = null
    this.paletteTextureHeight = 1;

    this.renderRequested = false
    this.initStage()
  }

  initStage() {
    const canvas = document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 60;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2.5;
    this.camera = camera

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 4;
    controls.update();
    this.controls = controls

    const scene = new THREE.Scene();
    window.scene = scene
    scene.background = new THREE.Color('#246');
    this.scene = scene

    const pickingScene = new THREE.Scene();
    pickingScene.background = new THREE.Color(0);
    this.pickingScene = pickingScene

    const selectedColor = this.get255BasedColor('red');
    this.initTexture()
    this.resetPalette();
    this.aaa()
  }

  get255BasedColor(color) {
    const tempColor = new THREE.Color();
    tempColor.set(color);
    return tempColor.toArray().map(v => v * 255);
  }

  initTexture() {
    this.palette = new Uint8Array(this.paletteTextureWidth * 3);
    this.paletteTexture = new THREE.DataTexture(
      this.palette,
      this.paletteTextureWidth,
      this.paletteTextureHeight,
      THREE.RGBFormat);
    this.paletteTexture.minFilter = THREE.NearestFilter;
    this.paletteTexture.magFilter = THREE.NearestFilter;
  }

  setPaletteColor(index, color) {
    this.palette.set(color, index * 3);
  }

  resetPalette() {
    const oceanColor = this.get255BasedColor('rgb(100,200,255)');
    const unselectedColor = this.get255BasedColor('#444');

    // make all colors the unselected color
    for (let i = 1; i < this.maxNumCountries; ++i) {
      this.setPaletteColor(i, unselectedColor);
    }

    // set the ocean color (index #0)
    this.setPaletteColor(0, oceanColor);
    this.paletteTexture.needsUpdate = true;
  }

  resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  requestRenderIfNotRequested() {
    if (!this.renderRequested) {
      this.renderRequested = true;
      requestAnimationFrame(render);
    }
  }

  render() {
    stageThat.renderRequested = undefined;
    if (stageThat.resizeRendererToDisplaySize(stageThat.renderer)) {
      const canvas = stageThat.renderer.domElement;
      stageThat.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      stageThat.camera.updateProjectionMatrix();
    }
  }

  loop() {
    stageThat.controls.update();
    stageThat.renderer.render(stageThat.scene, stageThat.camera);
    requestAnimationFrame(stageThat.loop);
  }

  async aaa() {
    const pickingScene = this.pickingScene
    // const loader = new THREE.TextureLoader();
    const geometry = new THREE.SphereBufferGeometry(1, 64, 32);

    const indexTexture = await loadTexture(res.uv)//loader.load(res.uv, this.render);
    indexTexture.minFilter = THREE.NearestFilter;
    indexTexture.magFilter = THREE.NearestFilter;

    // const pickingMaterial = new THREE.MeshBasicMaterial({ map: indexTexture });
    // pickingScene.add(new THREE.Mesh(geometry, pickingMaterial));

    const fragmentShaderReplacements = [
      {
        from: '#include <common>',
        to: fragment.f1,
      },
      {
        from: '#include <color_fragment>',
        to: fragment.f2,
      },
    ];

    const texture = await loadTexture(res.texture)
    const material = new THREE.MeshBasicMaterial({ map: texture });
    material.onBeforeCompile = function (shader) {
      fragmentShaderReplacements.forEach((rep) => {
        shader.fragmentShader = shader.fragmentShader.replace(rep.from, rep.to);
      });
      shader.uniforms.paletteTexture = { value: stageThat.paletteTexture };
      shader.uniforms.indexTexture = { value: indexTexture };
      shader.uniforms.paletteTextureWidth = { value: stageThat.paletteTextureWidth };
    };

    stageThat.scene.add(new THREE.Mesh(geometry, material));
    stageThat.render()
  }
}

class Labels {
  constructor() {
    let numCountriesSelected = 0;
    let countryInfos;
    const tempV = new THREE.Vector3();
    const cameraToPoint = new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    const normalMatrix = new THREE.Matrix3();

    const settings = {
      minArea: 20,
      maxVisibleDot: -0.2,
    };
  }

  loadCountryData() {
    countryInfos = res.countryInfo;

    const lonFudge = Math.PI * 1.5;
    const latFudge = Math.PI;
    // these helpers will make it easy to position the boxes
    // We can rotate the lon helper on its Y axis to the longitude
    const lonHelper = new THREE.Object3D();
    // We rotate the latHelper on its X axis to the latitude
    const latHelper = new THREE.Object3D();
    lonHelper.add(latHelper);
    // The position helper moves the object to the edge of the sphere
    const positionHelper = new THREE.Object3D();
    positionHelper.position.z = 1;
    latHelper.add(positionHelper);

    const labelParentElem = document.querySelector('#labels');
    for (const countryInfo of countryInfos) {
      const { lat, lon, min, max, name } = countryInfo;

      // adjust the helpers to point to the latitude and longitude
      lonHelper.rotation.y = THREE.Math.degToRad(lon) + lonFudge;
      latHelper.rotation.x = THREE.Math.degToRad(lat) + latFudge;

      // get the position of the lat/lon
      positionHelper.updateWorldMatrix(true, false);
      const position = new THREE.Vector3();
      positionHelper.getWorldPosition(position);
      countryInfo.position = position;

      // compute the area for each country
      const width = max[0] - min[0];
      const height = max[1] - min[1];
      const area = width * height;
      countryInfo.area = area;

      // add an element for each country
      const elem = document.createElement('div');
      elem.textContent = name;
      labelParentElem.appendChild(elem);
      countryInfo.elem = elem;
    }
    requestRenderIfNotRequested();
  }

  updateLabels() {
    // exit if we have not loaded the data yet
    if (!countryInfos) {
      return;
    }

    const large = settings.minArea * settings.minArea;
    // get a matrix that represents a relative orientation of the camera
    normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
    // get the camera's position
    camera.getWorldPosition(cameraPosition);
    for (const countryInfo of countryInfos) {
      const { position, elem, area, selected } = countryInfo;
      const largeEnough = area >= large;
      const show = selected || (numCountriesSelected === 0 && largeEnough);
      if (!show) {
        elem.style.display = 'none';
        continue;
      }

      // Orient the position based on the camera's orientation.
      // Since the sphere is at the origin and the sphere is a unit sphere
      // this gives us a camera relative direction vector for the position.
      tempV.copy(position);
      tempV.applyMatrix3(normalMatrix);

      // compute the direction to this position from the camera
      cameraToPoint.copy(position);
      cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();

      // get the dot product of camera relative direction to this position
      // on the globe with the direction from the camera to that point.
      // -1 = facing directly towards the camera
      // 0 = exactly on tangent of the sphere from the camera
      // > 0 = facing away
      const dot = tempV.dot(cameraToPoint);

      // if the orientation is not facing us hide it.
      if (dot > settings.maxVisibleDot) {
        elem.style.display = 'none';
        continue;
      }

      // restore the element to its default display style
      elem.style.display = '';

      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      tempV.copy(position);
      tempV.project(camera);

      // convert the normalized position to CSS coordinates
      const x = (tempV.x * .5 + .5) * canvas.clientWidth;
      const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

      // move the elem to that position
      elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

      // set the zIndex for sorting
      elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
    }
  }
}


class DDD {
  constructor() {
    const pickHelper = new GPUPickHelper();

    const maxClickTimeMs = 200;
    const maxMoveDeltaSq = 5 * 5;
    const startPosition = {};
    let startTimeMs;
  }

  getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  recordStartTimeAndPosition(event) {
    startTimeMs = performance.now();
    const pos = getCanvasRelativePosition(event);
    startPosition.x = pos.x;
    startPosition.y = pos.y;
  }

  pickCountry(event) {
    // exit if we have not loaded the data yet
    if (!countryInfos) {
      return;
    }

    // if it's been a moment since the user started
    // then assume it was a drag action, not a select action
    const clickTimeMs = performance.now() - startTimeMs;
    if (clickTimeMs > maxClickTimeMs) {
      return;
    }

    // if they moved assume it was a drag action
    const position = getCanvasRelativePosition(event);
    const moveDeltaSq = (startPosition.x - position.x) ** 2 +
      (startPosition.y - position.y) ** 2;
    if (moveDeltaSq > maxMoveDeltaSq) {
      return;
    }

    const id = pickHelper.pick(position, pickingScene, camera);
    if (id > 0) {
      const countryInfo = countryInfos[id - 1];
      const selected = !countryInfo.selected;
      if (selected && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
        unselectAllCountries();
      }
      numCountriesSelected += selected ? 1 : -1;
      countryInfo.selected = selected;
      setPaletteColor(id, selected ? selectedColor : unselectedColor);
      paletteTexture.needsUpdate = true;
    } else if (numCountriesSelected) {
      unselectAllCountries();
    }
    requestRenderIfNotRequested();
  }

  unselectAllCountries() {
    numCountriesSelected = 0;
    countryInfos.forEach((countryInfo) => {
      countryInfo.selected = false;
    });
    resetPalette();
  }

  initInterface() {
    canvas.addEventListener('mousedown', recordStartTimeAndPosition);
    canvas.addEventListener('mouseup', pickCountry);

    let lastTouch;
    canvas.addEventListener('touchstart', (event) => {
      // prevent the window from scrolling
      event.preventDefault();
      lastTouch = event.touches[0];
      recordStartTimeAndPosition(event.touches[0]);
    }, { passive: false });
    canvas.addEventListener('touchsmove', (event) => {
      lastTouch = event.touches[0];
    });
    canvas.addEventListener('touchend', () => {
      pickCountry(lastTouch);
    });
  }


}


function main() {
  let stage = new Stage()
  stage.loop()
  // controls.addEventListener('change', requestRenderIfNotRequested);
  // window.addEventListener('resize', requestRenderIfNotRequested);
}


