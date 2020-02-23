import * as THREE from './lib/three.module.js'
import { fragment } from "./glsl.fragment.js";
import { vertex } from "./glsl.vertex.js";

const gsap = window.gsap

export default class Plan {
  constructor({
    img,
    width,
    height
  }, stage) {
    this.stage = stage
    this.mesh = this.createMesh({
      width,
      height,
      image: img,
      iWidth: img.width,
      iHeight: img.height
    });

    this.mesh.name = "test"
    this.stage.scene.add(this.mesh);
  }

  createMesh(o) {
    let texture = new THREE.Texture(o.image);
    texture.needsUpdate = true;
    // image cover
    let imageAspect = o.iHeight / o.iWidth;
    let a1;
    let a2;
    if (o.height / o.width > imageAspect) {
      a1 = (o.width / o.height) * imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = o.height / o.width / imageAspect;
    }
    texture.minFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneBufferGeometry(1, 1, 80, 80);
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        progress: { type: "f", value: 0 },
        angle: { type: "f", value: 0 },
        texture1: { type: "t", value: null },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment
    });
    material.uniforms.resolution.value.x = o.width;
    material.uniforms.resolution.value.y = o.height;
    material.uniforms.resolution.value.z = a1;
    material.uniforms.resolution.value.w = a2;
    material.uniforms.progress.value = 0.5;
    material.uniforms.angle.value = 0.5;
    material.uniforms.texture1.value = texture;
    material.uniforms.texture1.value.needsUpdate = true;

    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(o.width, o.height, o.width / 2);
    return mesh;
  }

  startRoll(angle) {
    let radians = (angle * Math.PI) / 180;
    this.mesh.material.uniforms.angle.value = radians
    gsap.fromTo(
      this.mesh.material.uniforms.progress,
      {
        value: 0,
      },
      {
        duration: 2.5,
        value: 1,
        ease: "power2.out",
        onUpdate: () => {
        }
      }
    );
  }
}
