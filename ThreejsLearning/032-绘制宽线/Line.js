import * as THREE from './lib/three.module.js'
import { lineVert } from './glsl_mesh_line_vert.js'
import { lineFrag } from './glsl_mesh_line_frag.js'


export class Line {
  constructor() {
    this.positions = [];
    this.previous = [];
    this.next = [];
    // 边
    this.side = [];
    this.indices_array = [];
    this.geometry = new THREE.BufferGeometry();
    this.widthCallback = null;
  }

  setGeometry(g, callback) {
    this.widthCallback = callback;
    this.positions = [];

    if (g instanceof Float32Array || g instanceof Array) {
      for (var j = 0; j < g.length; j += 3) {
        var c = j / g.length;
        this.positions.push(g[j], g[j + 1], g[j + 2]);
        this.positions.push(g[j], g[j + 1], g[j + 2]);
      }
    }
    this.process();
  }

  compareV3(a, b) {
    var aa = a * 6;
    var ab = b * 6;
    let ret = false
    ret =
      (this.positions[aa] === this.positions[ab]) &&
      (this.positions[aa + 1] === this.positions[ab + 1]) &&
      (this.positions[aa + 2] === this.positions[ab + 2]);
    return ret
  }

  copyV3(a) {
    var aa = a * 6;
    return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
  }

  process() {
    let l = this.positions.length / 6;
    this.l = l
    this.previous = [];
    this.next = [];
    this.side = [];
    this.indices_array = [];

    // 边
    for (var j = 0; j < l; j++) {
      this.side.push(1);
      this.side.push(-1);
    }

    // 前一个
    let v = this.copyV3(0);
    this.previous.push(v[0], v[1], v[2]);
    this.previous.push(v[0], v[1], v[2]);
    for (var j = 0; j < l - 1; j++) {
      v = this.copyV3(j);
      this.previous.push(v[0], v[1], v[2]);
      this.previous.push(v[0], v[1], v[2]);
    }

    // 下一个
    for (var j = 1; j < l; j++) {
      v = this.copyV3(j);
      this.next.push(v[0], v[1], v[2]);
      this.next.push(v[0], v[1], v[2]);
    }
    v = this.copyV3(l - 1);
    this.next.push(v[0], v[1], v[2]);
    this.next.push(v[0], v[1], v[2]);

    // 顶点索引
    for (var j = 0; j < l - 1; j++) {
      var n = j * 2;
      this.indices_array.push(n, n + 1, n + 2);
      this.indices_array.push(n + 2, n + 1, n + 3);
    }
    console.error(this);

    this.attributes = {
      position: new THREE.BufferAttribute(new Float32Array(this.positions), 3),
      previous: new THREE.BufferAttribute(new Float32Array(this.previous), 3),
      next: new THREE.BufferAttribute(new Float32Array(this.next), 3),
      side: new THREE.BufferAttribute(new Float32Array(this.side), 1),
      index: new THREE.BufferAttribute(new Uint16Array(this.indices_array), 1),
    }

    this.geometry.setAttribute('position', this.attributes.position);
    this.geometry.setAttribute('previous', this.attributes.previous);
    this.geometry.setAttribute('next', this.attributes.next);
    this.geometry.setAttribute('side', this.attributes.side);
    this.geometry.setIndex(this.attributes.index);
  }
}

export class LineMaterial extends THREE.ShaderMaterial {
  isMeshLineMaterial = true

  constructor(parameters) {
    super({
      uniforms: Object.assign({},
        {
          lineWidth: { value: 1 },
          useAlphaMap: { value: 0 },
          color: { value: new THREE.Color(0xffffff) },
          resolution: { value: new THREE.Vector2(1, 1) },
          sizeAttenuation: { value: 1 },
        }
      ),
      vertexShader: lineVert,
      fragmentShader: lineFrag,
    })
    this.type = 'MeshLineMaterial';

    Object.defineProperties(this, {
      lineWidth: {
        enumerable: true,
        get: function () {
          return this.uniforms.lineWidth.value;
        },
        set: function (value) {
          this.uniforms.lineWidth.value = value;
        }
      },
      color: {
        enumerable: true,
        get: function () {
          return this.uniforms.color.value;
        },
        set: function (value) {
          this.uniforms.color.value = value;
        }
      },
      resolution: {
        enumerable: true,
        get: function () {
          return this.uniforms.resolution.value;
        },
        set: function (value) {
          this.uniforms.resolution.value.copy(value);
        }
      }
    });

    this.setValues(parameters);
  }
  copy(source) {
    this.copy(source)
    this.lineWidth = source.lineWidth;
    this.color.copy(source.color);
    this.resolution.copy(source.resolution);
    this.sizeAttenuation = source.sizeAttenuation;

    return this;

  }
}




