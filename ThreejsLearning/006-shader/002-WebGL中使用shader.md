> 参考:https://www.yiibai.com/webgl/webgl_shaders.html

### WebGL中使用shader
#### 1、编写shader代码
#### 2、编译
- 创建shader对象: Object createShader (enum type)
- 附加: void shaderSource(Object shader, string source)
- 编译程序: compileShader(Object shader)

```js
// Vertex Shader
var vertCode =
   `attribute vec2 coordinates;
   void main(void) {
      gl_Position = vec4(coordinates, 0.0, 1.0);
   }`
      
var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);
 
// Fragment Shader
var fragCode =
   `void main(void) {
      gl_FragColor = vec4(0, 0.8, 0, 1);
   }`
      
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);
```
#### 3、合并程序
- 创建一个程序对象: createProgram();
- 附加两个着色器: attachShader(Object program, Object shader);
- 连接两个着色器: linkProgram(shaderProgram);
- 使用程序: useProgram(shaderProgram);

```js
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
```