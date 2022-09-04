const vertex = /* glsl */ `
  uniform vec2 iOffset;

  varying vec2 vUv;
  varying vec2 vOffset;

  float M_PI = 3.141529;

  vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset){
    position.x = position.x + (sin(uv.y * M_PI) * offset.x);
    position.y = position.y + (sin(uv.x * M_PI) * offset.y);
    return position;
  }

  void main() {
    vUv = uv;
    vOffset = iOffset;
    vec3 newPosition = deformationCurve(position, uv, iOffset);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

export default vertex
