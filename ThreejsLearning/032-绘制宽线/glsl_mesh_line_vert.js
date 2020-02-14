export const lineVert=`
attribute vec3 previous;
attribute vec3 next;
attribute float side;

uniform vec2 resolution;
uniform float lineWidth;
uniform vec3 color;

varying vec4 vColor;

vec2 fix(vec4 i,float aspect){
  vec2 res=i.xy/i.w;
  res.x*=aspect;
  return res;
}

void main(){
  vColor=vec4(color,1.);
  mat4 m=projectionMatrix*modelViewMatrix;
  
  vec4 finalPosition=m*vec4(position,1.);
  vec4 prevPos=m*vec4(previous,1.);
  vec4 nextPos=m*vec4(next,1.);
  
  float aspect=resolution.x/resolution.y;
  vec2 currentP=fix(finalPosition,aspect);
  vec2 prevP=fix(prevPos,aspect);
  vec2 nextP=fix(nextPos,aspect);
  
  vec2 dir;
  if(nextP==currentP){
    dir=normalize(currentP-prevP);
  }else if(prevP==currentP){
    dir=normalize(nextP-currentP);
  }else{
    vec2 dir1=normalize(currentP-prevP);
    vec2 dir2=normalize(nextP-currentP);
    dir=normalize(dir1+dir2);
  }
  
  vec2 offset=vec2(-dir.y,dir.x)*side*lineWidth;
  finalPosition.xy+=offset.xy;
  finalPosition.z=0.;
  gl_Position=finalPosition;
}`
