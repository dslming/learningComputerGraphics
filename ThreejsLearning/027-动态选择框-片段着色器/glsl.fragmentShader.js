export let fragmentShader=`
#extension GL_EXT_shader_texture_lod:enable
#extension GL_OES_standard_derivatives:enable

uniform vec3 u_resolution;
uniform float u_time;
uniform sampler2D iChannel0;

void mainImage(out vec4 fragColor,in vec2 fragCoord){
  vec2 uv=fragCoord.xy/u_resolution.xy;
  vec4 outputColor=texture2D(iChannel0,vec2(fract(uv.x),fract(uv.y)));
  
  // rect boundaries
  vec2 rectMin=vec2(.2,.2);
  vec2 rectMax=vec2(.4,.4);
  vec2 center=(rectMin+rectMax)/2.;
  vec2 halfSize=center-rectMin;
  vec2 fw=fwidth(uv);
  
  vec2 dist=abs(uv-center);
  
  float col=0.;
  if(
    all(lessThan(dist,halfSize))&&
    any(greaterThan(dist,halfSize-fw))
  ){
    vec2 pixel=fragCoord.xy;
    // vec2 pixel=uv/fw;
    float aspect=halfSize.y/halfSize.x;
    float dir=(dist.x*aspect>dist.y)?
    -sign(uv.x-center.x):sign(uv.y-center.y);
    float dash=step(.5,
      fract((pixel.x+pixel.y)*dir/10.+u_time));
      col=mix(1.,0.,dash);
      fragColor=vec4(col,col,col,1.);
    }else{
      fragColor=outputColor;
    }
    
  }
  
  void main(){
    // gl_FragColor=vec4(color,1.);
    mainImage(gl_FragColor,gl_FragCoord.xy);
  }
  `
  