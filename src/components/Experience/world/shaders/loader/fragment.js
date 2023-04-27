const fragment = /* glsl */ `
  #define layers 2 //int how many layers

  uniform float iTime;
  uniform float iAlpha;
  uniform float iLight;
  uniform vec2 iResolution;
  uniform float scale;
  uniform float speed;

  varying vec2 vUv;
  varying vec3 vNormal;

  float PI = 3.141529;

  vec3 hash( vec3 p ) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5,271.9, 124.6)));
    p = -1.0 + 2.0 * fract(sin(p) * 43758.5453123);

    return p;
  }

  float noise( in vec3 p ) {
    vec3 i = floor( p );
    vec3 f = fract( p );
    
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                    mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                    mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                          dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
  }

  void main() {
    //normalized device coordinates from -1 to 1
    vec2 uv = (gl_FragCoord.xy - iResolution.xy - 0.5) / iResolution.y;

    //time value
    float t = iTime * speed;

    uv *= scale;

    float h = noise(vec3(uv * 2.0, t));

    //uv distortion loop 
    for (int n = 1; n < layers; n++){
      float i = float(n);
      uv -= vec2(0.7 / i * sin(i * uv.y + i + t * 5.0 + h * i) + 0.8, 0.4 / i * sin(uv.x+4.-i+h + t * 5.0 + 0.3 * i) + 1.6);
    }

    uv -= vec2(1.2 * sin(uv.x + t + h) + 1.8, 0.4 * sin(uv.y + t + 0.3 * h) + 1.6);

    // Time varying pixel color
    vec3 col = vec3(
      0.01 * sin(uv.x) + 0.1,
      .01 * sin(uv.x) + 0.2,
      0.9 * sin(uv.y + uv.x) + 0.9
    ) * iLight;

    // Output to screen
    gl_FragColor = vec4(col, iAlpha);
  }
`

export default fragment
