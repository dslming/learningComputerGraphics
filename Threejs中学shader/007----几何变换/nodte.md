https://thebookofshaders.com/08/?lan=ch

### 基本变换
#### 1、平移
```js
uniform vec2 u_resolution;
uniform float u_time;

float box(in vec2 st, in vec2 size){
  size = vec2(0.5) - size*0.25;
  vec2 uv = step(size, st);
  uv *= step(size, vec2(1.0) - st);
  return uv.x * uv.y;
}

float cross(in vec2 st, float size){
  float a = box(st, vec2(size, size/4.));
  float b = box(st, vec2(size/4., size));
  return a + b;
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(.0);

  // 为了移动十字架，我们移动了空间
  vec2 translate = vec2(cos(u_time), sin(u_time));
  st += translate*.2;

  // 在背景上显示空间的坐标
  // color = vec3(st.x, st.y, .0);

  // 在前景上添加形状
  color += vec3(cross(st, .25));

  gl_FragColor = vec4(color,1.0);
}
```

#### 2、旋转
```js
#define PI 3.14159265359
uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float angle){
  return mat2(cos(angle), -sin(angle),
              sin(angle), cos(angle));
  }

float box(in vec2 st, in vec2 size){
  size = vec2(0.5) - size*0.5;
  vec2 uv = smoothstep(size,
                      size+vec2(0.001),
                      st);
  uv *= smoothstep(size,
                  size+vec2(0.001),
                  vec2(1.0)-st);
  return uv.x*uv.y;
}

float cross(in vec2 st, float size){
  return  box(st, vec2(size,size/4.)) +
          box(st, vec2(size/4.,size));
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(0.0);

  // move space from the center to the vec2(0.0)
  st -= vec2(0.5);
  // rotate the space
  st = rotate2d( sin(u_time)*PI ) * st;
  // move it back to the original place
  st += vec2(0.5);

  // Show the coordinates of the space on the background
  // color = vec3(st.x,st.y,0.0);

  // Add the shape on the foreground
  color += vec3(cross(st,0.4));
  gl_FragColor = vec4(color,1.0);
}
```

#### 3、缩放
```js
mat2 scale(vec2 scale){
    return mat2(scale.x,0.0,
                0.0,scale.y);
}

float box(in vec2 st, in vec2 size){
    size = vec2(0.5) - size*0.5;
    vec2 uv = smoothstep(size,
                        size+vec2(0.001),
                        st);
    uv *= smoothstep(size,
                    size+vec2(0.001),
                    vec2(1.0)-st);
    return uv.x*uv.y;
}

float cross(in vec2 st, float size){
    return  box(st, vec2(size,size/4.)) +
            box(st, vec2(size/4.,size));
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(0.0);

  st -= vec2(0.5);
  st = scale( vec2(sin(u_time)+1.0) ) * st;
  st += vec2(0.5);

  // Show the coordinates of the space on the background
  // color = vec3(st.x,st.y,0.0);

  // Add the shape on the foreground
  color += vec3(cross(st,0.2));

  gl_FragColor = vec4(color,1.0);
}
```
