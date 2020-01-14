import { Vector3 } from './lib/Vector3.js';
import { Vector2 } from './lib/Vector2.js';
/**
 * 圆形平面
 */
export default class CircleGeometry {
  /**
  * radius: 扇形的半径，也是三角形的等边长度
  * segments: 组成扇形的三角形的数量
  * thetaStart: 扇形的起始角度
  * thetaLength: 扇形的圆心角，
  **/
  constructor({ radius, segments, thetaStart, thetaLength }) {
    // 调用时的参数
    this.parameters = {
      radius: radius,
      segments: segments,
      thetaStart: thetaStart,
      thetaLength: thetaLength
    };
    this.type = 'CircleBufferGeometry';

    // 参数检查
    this.radius = radius || 1
    this.segments = segments !== undefined ? Math.max(3, segments) : 8;
    this.thetaStart = thetaStart !== undefined ? thetaStart : 0;
    this.thetaLength !== undefined ? thetaLength : Math.PI * 2;

    // ---- buffers ----
    // 顶点索引
    let indices = []
    // 顶点坐标
    let vertices = [];
    // 法线
    let normals = [];
    // uv坐标
    let uvs = [];

    // ---- helper variables ----
    let i, s;
    let vertex = new Vector3();
    let uv = new Vector2();

    // ---- center point ----
    vertices.push(0, 0, 0);
    normals.push(0, 0, 1);
    uvs.push(0.5, 0.5);

    for (s = 0, i = 3; s <= segments; s++ , i += 3) {
      var segment = thetaStart + s / segments * thetaLength;
      // vertex
      vertex.x = radius * Math.cos(segment);
      vertex.y = radius * Math.sin(segment);
      vertices.push(vertex.x, vertex.y, vertex.z);

      // normal
      normals.push(0, 0, 1);

      // uvs
      uv.x = (vertices[i] / radius + 1) / 2;
      uv.y = (vertices[i + 1] / radius + 1) / 2;
      uvs.push(uv.x, uv.y);
    }

    // indices
    for (i = 1; i <= segments; i++) {
      indices.push(i, i + 1, 0);
    }

    // build geometry
    // this.setIndex(indices);
    // this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    // this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    // this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  }
}
