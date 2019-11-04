> 参考: https://www.shadertoy.com/view/XdlSDs

> 时间: 2019/9/13
> 作者: dslming
> note: 这个曾经是我的一个面试编程题, 当时没有写出来😢。

#### 1、片元着色器代码
```js
uniform vec2 iResolution;
    uniform float iTime;

    /**
     * 获取颜色
     */
    vec3 getColor(vec2 uv) {
      float xCol = (uv.x - (iTime / 3.0)) * 3.0;
      xCol = mod(xCol, 3.0);
      vec3 horColour = vec3(0.25, 0.25, 0.25);

      if (xCol < 1.0) {
        horColour.r += 1.0 - xCol;
        horColour.g += xCol;
      }
      else if (xCol < 2.0) {
        xCol -= 1.0;
        horColour.g += 1.0 - xCol;
        horColour.b += xCol;
      }
      else {
        xCol -= 2.0;
        horColour.b += 1.0 - xCol;
        horColour.r += xCol;
      }
      return horColour;
    }

    /**
     * 绘制光束
     */
    vec3 drewBeam(vec2 uv, float tau) {
      uv = (2. * uv) - 1.;
      float aaa = abs(1.0 / (30. * uv.y));
      float bbb = clamp(floor(5.+ 10. * cos(iTime)), .0, 10.);
      float ccc = cos(uv.x * 10. * tau * .15 * bbb);
      float beamWidth = (.7 + .5*ccc) * aaa;
      return vec3(beamWidth);
    }

    void main(){
      vec2 p = (2.*gl_FragCoord.xy-iResolution.xy) / iResolution.y;
      float a = atan(p.x,p.y);
      float tau = 3.1415926535*2.0;
      float r = length(p)*0.75;
      vec2 uv = vec2(a/tau,r);

      gl_FragColor = vec4(drewBeam(uv, tau) * getColor(uv), 1.0);
    }
```
