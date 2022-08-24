import * as THREE from 'three'
import { MeshStandardMaterial, ShaderMaterial, MeshBasicMaterial } from 'three'
import Experience from '../../../Experience'

function OutlineMaterial(): (MeshStandardMaterial | ShaderMaterial | MeshBasicMaterial)[] {
  const experience = new Experience()
  const resources = experience.resources
  const time = experience.time
  // const debug = experience.debug

  const skin = resources.items.manSkinDisplacement as THREE.Texture
  skin.repeat.set(1, 1)
  skin.wrapS = THREE.MirroredRepeatWrapping
  skin.wrapT = THREE.MirroredRepeatWrapping

  // let debugFolder
  // if (debug.active) {
  //   debugFolder = debug.ui?.addFolder('Man')
  // }

  const sha0 = THREE.ShaderLib.basic
  const mat0 = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: THREE.UniformsUtils.merge([
      sha0.uniforms,
      {
        diffuse: { value: new THREE.Color('white') }
      }
    ]),
    vertexShader: sha0.vertexShader.replace(
      '#include <begin_vertex>',
      `
        vec3 transformed = vec3(position) + normal * 0.01;
      `
    ),
    fragmentShader: sha0.fragmentShader
  })

  const mat1 = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    map: skin
    // color: new THREE.Color(0xffffff),
    // emissive: new THREE.Color(0xffffff)
    // emissiveMap: skin,
    // emissiveIntensity: 0.8,
    // emissive: 'black'
  })
  const mat2 = new THREE.MeshBasicMaterial({ color: 'black', wireframe: true })

  time.on('tick', () => {
    skin.offset.y -= 0.0002
  })

  return [mat0, mat1, mat2]
}

export default OutlineMaterial
