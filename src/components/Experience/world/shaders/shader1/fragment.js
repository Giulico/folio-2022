const fragment = /* glsl */ `
  varying float qnoise;
  
  uniform float time;
  uniform bool redhell;
  uniform float r_color;
  uniform float g_color;
  uniform float b_color;

  void main() {
    float r, g, b;

    r = cos(qnoise + (r_color));
    g = cos(qnoise + g_color);
    b = cos(qnoise + (b_color));
    
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`

export default fragment
