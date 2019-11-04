import shaderVert from './shader/skybox_vert.glsl'
import shaderFrag from './shader/skybox_frag.glsl'

const THREE = (window as any).THREE
const TweenLite = (window as any).TweenLite

export default class Skybox {
  boxMat: any;
  constructor(_scene: { add: (arg0: any) => void; }, _color: any) {
    var boxGeom = new THREE.BoxBufferGeometry(1, 1, 1);
    // this.boxMat = new THREE.ShaderMaterial({
    //   uniforms: {
    //     tCube: { value: null },
    //     tFlip: { value: -1 },
    //     color: { value: _color }
    //   },
    //   vertexShader: shaderVert,
    //   fragmentShader: shaderFrag,
    //   side: THREE.BackSide,
    //   depthTest: true,
    //   depthWrite: false,
    //   fog: false
    // });
    this.boxMat = new THREE.MeshStandardMaterial({ color: 0xffffff })
    var boxMesh = new THREE.Mesh(boxGeom, this.boxMat);
    boxMesh.name = 'boxMesh'
    // boxGeom.removeAttribute('normal');
    // boxGeom.removeAttribute('uv');
    _scene.add(boxMesh);
    // boxMesh.onBeforeRender = function (renderer: any, scene: any, camera: { matrixWorld: any; }) {
    //   this.matrixWorld.copyPosition(camera.matrixWorld);
    // };
  }
  updateLight(_newVal: any) {
    // this.boxMat.uniforms.light.value = _newVal;
  };
  setCubeTexture(_cubeTex: any) {
    this.boxMat.envMap = _cubeTex
    // this.boxMat.uniforms.tCube.value = _cubeTex;
  }
}
