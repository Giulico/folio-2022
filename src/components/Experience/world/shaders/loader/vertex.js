const vertex = /* glsl */ `
  // switch on high precision floats
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export default vertex
