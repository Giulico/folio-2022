const fragment = /* glsl */ `
  precision mediump float;
    
  uniform float iFactor;
  uniform sampler2D iChannel0;
  uniform sampler2D iChannel1;
  uniform vec3 iColorOuter;
  uniform vec3 iColorInner;

  varying vec2 vUv;

  void main() {
    vec3 pixel = vec3(0);
      
    float height = texture(iChannel1, vUv).r;

    pixel = texture(iChannel0, vUv).rgb;
      
    float condition_if_1 = step(height, sin(iFactor - 0.04));
    float condition_if_2 = step(height, sin(iFactor - 0.02));
    float condition_if_3 = step(height, sin(iFactor));

    // Burned layers
    pixel = pixel * (1. - condition_if_1) + vec3(iColorOuter) * condition_if_1;
    pixel = pixel * (1. - condition_if_2) + vec3(iColorInner) * condition_if_2;
    // Black layer
    pixel = pixel * (1. - condition_if_3);

    // Transparency on black layer
    if (pixel == vec3(0)) {
      gl_FragColor = vec4(pixel, 0.0);
    } else {
      gl_FragColor = vec4(pixel, 1.0);
    }
  }
`

export default fragment
