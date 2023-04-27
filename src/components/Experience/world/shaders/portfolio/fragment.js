const fragment = /* glsl */ `
  precision mediump float;
    
  uniform float iFactor;
  uniform sampler2D iChannel0;
  uniform sampler2D iChannel1;
  uniform vec3 iColorOuter;
  uniform vec3 iColorInner;

  varying vec2 vOffset;
  varying vec2 vUv;

  vec3 rgbShift(sampler2D textureimage, vec2 uv, vec2 offset ){
    float r = texture2D(textureimage, uv + offset).r;
    vec2 gb = texture2D(textureimage, uv).gb;
    return vec3(r, gb);
  }

  void main() {
    vec3 pixel = vec3(0);
      
    float height = texture(iChannel1, vUv).r;

    pixel = rgbShift(iChannel0, vUv, vOffset).rgb;
      
    float condition_if_1 = step(height, sin(iFactor - 0.04));
    float condition_if_2 = step(height, sin(iFactor - 0.02));
    float condition_if_3 = step(height, sin(iFactor));

    // Burned layers
    pixel = pixel * (1. - condition_if_1) + vec3(iColorOuter) * condition_if_1;
    pixel = pixel * (1. - condition_if_2) + vec3(iColorInner) * condition_if_2;
    // Black layer
    pixel = pixel * (1. - condition_if_3);

    vec4 reveal = vec4(0.0);

    // Transparency on black layer
    if (pixel == vec3(0)) {
      reveal = vec4(pixel, 0.0);
    } else {
      reveal = vec4(pixel, 1.0);
    }

    gl_FragColor = reveal;
  }
`

export default fragment
