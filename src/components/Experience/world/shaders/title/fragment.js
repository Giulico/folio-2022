const fragment = /* glsl */ `
  // Varyings
  #include <three_msdf_varyings>

  // Uniforms
  #include <three_msdf_common_uniforms>
  #include <three_msdf_strokes_uniforms>

  // Utils
  #include <three_msdf_median>

  uniform float uProgress1;
  uniform float uProgress2;
  uniform float uProgress3;
  uniform float uProgress4;
  uniform float uProgress5;
  uniform float uProgress6;
  uniform float uProgress7;
  uniform float uDirection;

  float rand(float n){return fract(sin(n) * 43758.5453123);}

  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(float p){
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
  }
    
  float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
  }

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  float progress(float uvaxe, float progress_, float pattern, float fadeWidth) {
    float p_ = map(progress_, 0.0, 1.0, -fadeWidth, 1.0);
    p_ = smoothstep(p_, p_ + fadeWidth, uvaxe);
    float mix1 = 2.0 * p_ - pattern;
    return clamp(mix1, 0.0, 1.0); 
  }

  void main() {
    // Common
    #include <three_msdf_common>

    // Strokes
    #include <three_msdf_strokes>

    // Alpha Test
    // #include <three_msdf_alpha_test>

    // Outputs
    #include <three_msdf_strokes_output>

    vec3 pink = vec3(0.834, 0.066, 0.780);
    vec3 blue = vec3(0.282,0.616,0.933);
    vec3 darkBlue = vec3(0.,0.039,0.827);
    vec3 darkGray = vec3(0.118,0.118,0.118);
    vec3 white = vec3(1.0, 1.0, 1.0);

    // Effects
    vec4 l1 = vec4(white, border * uOpacity);
    vec4 l2 = vec4(white, outset * uOpacity);
    vec4 l3 = vec4(darkBlue, outset * uOpacity);
    vec4 l4 = vec4(white, border * 0.6 * uOpacity);
    vec4 l5 = vec4(darkBlue, border * uOpacity);
    vec4 l6 = vec4(darkBlue, outset * uOpacity);
    vec4 l7 = vec4(white, outset * uOpacity);

    // Noise pattern
    float x = floor(vLayoutUv.x * 10. * 1.8);
    float y = floor(vLayoutUv.y * 10.);
    float pattern = noise(vec2(x, y));

    // Reveal
    float mix1 = progress(vLayoutUv.x, uProgress1, pattern, 0.7);
    float mix2 = progress(vLayoutUv.x, uProgress2, pattern, 0.7);
    float mix3 = progress(vLayoutUv.x, uProgress3, pattern, 0.7);
    float mix4 = progress(vLayoutUv.x, uProgress4, pattern, 0.7);

    // Menu
    float d = uDirection == 0.0 ? vLayoutUv.y : uDirection - vLayoutUv.y;
    float mix5 = progress(d, uProgress5, pattern, 0.7);
    float mix6 = progress(d, uProgress6, pattern, 0.7);
    float mix7 = progress(d, uProgress7, pattern, 0.7);

    vec4 layer1 = mix(vec4(0.0), l1, 1.0 - mix1);
    vec4 layer2 = mix(layer1, l2, 1.0 - mix2);
    vec4 layer3 = mix(layer2, l3, 1.0 - mix3);
    vec4 layer4 = mix(layer3, l4, 1.0 - mix4);
    vec4 layer5 = mix(layer4, l5, 1.0 - mix5);
    vec4 layer6 = mix(layer5, l6, 1.0 - mix6);
    vec4 layer7 = mix(layer6, l7, 1.0 - mix7);

    gl_FragColor = layer7;
  }
`

export default fragment
