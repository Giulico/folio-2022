import * as THREE from 'three'

const vertex = /* glsl */ `
  // switch on high precision floats
  #ifdef GL_ES
  precision highp float;
  #endif

  varying vec2 vUv;
  varying vec3 vNormal;

  ${THREE.ShaderChunk['common']}
  ${THREE.ShaderChunk['shadowmap_pars_vertex']}
  ${THREE.ShaderChunk['morphtarget_pars_vertex']}
  ${THREE.ShaderChunk['skinning_pars_vertex']}


  void main() {
    vUv = uv;
    vNormal = normal;

    ${THREE.ShaderChunk['skinbase_vertex']}
    ${THREE.ShaderChunk['begin_vertex']}
    ${THREE.ShaderChunk['morphtarget_vertex']}
    ${THREE.ShaderChunk['skinning_vertex']}
    ${THREE.ShaderChunk['project_vertex']}

    gl_Position = projectionMatrix * mvPosition;

    ${THREE.ShaderChunk['shadowmap_vertex']}
  }
`

export default vertex
