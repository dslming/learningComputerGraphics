let f1 = `
  #include <common>
  // 红色的uv
  uniform sampler2D indexTexture;
  uniform sampler2D paletteTexture;
  uniform float paletteTextureWidth;
`

let f2 = `
  #include <color_fragment>
  {
    vec4 indexColor = texture2D(indexTexture, vUv);
    float index = indexColor.r * 255.0 + indexColor.g * 255.0 * 256.0;
    vec2 paletteUV = vec2((index + 0.5) / paletteTextureWidth, 0.5);
    vec4 paletteColor = texture2D(paletteTexture, paletteUV);
    // black outlines
    diffuseColor.rgb = paletteColor.rgb - diffuseColor.rgb;
  }
`

const fragment = {
  f1,
  f2
}
