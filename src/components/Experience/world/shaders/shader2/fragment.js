const fragment = /* glsl */ `
  #define M_PI 3.1415926535897932384626433832795

// CPU interact
uniform vec2 u_mouse;
uniform float u_time;
uniform vec2 iResolution;
uniform float iGlobalTime;

uniform float iRandomGreen;
uniform float iRandomRed;
uniform float iRandomBlue;

uniform float iRandomSpeed;

varying vec2 vertexUV; 

void main(void){
          float time = iGlobalTime * iRandomSpeed;

          float devilRatio = 0.666;
          float mouseMoveVelocityReduce = M_PI * devilRatio;
          float goldenRatio = 1.618;


          // CPU Interact Calc
          vec2 state = gl_FragCoord.xy / iResolution;
          vec2 mouse = u_mouse.xy / iResolution;
          vec2 offset = vec2(mouse.x, mouse.y);
float dist = distance(state, offset);
// ---

float reducedM_X = mouse.x / mouseMoveVelocityReduce;
float reducedM_Y = mouse.y / mouseMoveVelocityReduce;

vec2 uv = (-1.0 + 2.0 * vertexUV) * M_PI * devilRatio;

float linesFactor = 1.4;
float densityFactor = 1.9;
float noiseFactor = 1.4;
float extra = 0.6;

const int quality = 20;


for(int s = 0; s < quality; s++) {
  vec2 wave = vec2(
    sin((uv.y + reducedM_Y * M_PI) * linesFactor - extra + time / densityFactor), 
    cos((uv.x + reducedM_X * M_PI) * linesFactor - extra + time / densityFactor)
  ) / noiseFactor * dist * M_PI * 0.666 / 2.0;

  wave += vec2(-wave.y, wave.x) * sin(reducedM_X + reducedM_Y) / cos(reducedM_X + reducedM_Y);

  uv.xy += wave - (reducedM_X * goldenRatio + reducedM_Y * goldenRatio) / M_PI / 0.5;

  linesFactor *= 1.93;
  densityFactor *= 1.15;
  noiseFactor *= 1.7;
  extra += 0.65 + 0.1 * time * densityFactor;
}

float mix_interpolate = 0.15;

float r1 = sin(uv.x - time) * iRandomRed + 0.6;
float b1 = sin(uv.y + time) * iRandomBlue + 0.6;
float g1 = sin(uv.x - time) * iRandomGreen + 0.4;

float r2 = sin(uv.x + time) * abs(sin(devilRatio * goldenRatio + time));
float b2 = sin(uv.y - time) * abs(sin(devilRatio * goldenRatio + time));
float g2 = sin(uv.x + time) * abs(sin(devilRatio * goldenRatio + time));

vec3 color1 = vec3(r1, g1, b1);
vec3 color2 = vec3(r2, g2, b2);

vec3 mix1 = mix(color1, color2, mix_interpolate);

gl_FragColor = vec4(mix1, 1.0);
}
`

export default fragment
