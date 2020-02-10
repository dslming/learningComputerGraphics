export default class ShaderDash{
  static getShaderData(opt){
    opt=opt||{};
    var ret=Object.assign({
        transparent:true,
        uniforms:{
          dashSteps:{type:'f',value:10},
          dashDistance:{type:'f',value:.5},
        },
        vertexShader:`
        attribute float lineDistance;
        varying float lineU;
        
        void main(){
          lineU=lineDistance;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
        }`,
        fragmentShader:`
        // 当前点距离起点的距离
        varying float lineU;
        uniform float dashSteps;
        uniform float dashDistance;
        
        void main(){
          float lineUMod=mod(lineU,1./dashSteps)*dashSteps;
          float dash=step(dashDistance,lineUMod);
          gl_FragColor=vec4(vec3(dash),1.);
        }`
    },opt);
    
    return ret;
  }
}
