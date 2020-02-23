export let fragment = `
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;

varying vec2 vUv;
varying float vFrontShadow;

void main(){
    vec2 newUV=(vUv-vec2(.5))*resolution.zw+vec2(.5);
    gl_FragColor=texture2D(texture1,newUV);
    gl_FragColor.rgb *= vFrontShadow;
    // gl_FragColor.a=clamp(progress*5.,0.,1.);
}
`
