import * as THREE from 'three'
import Experience from '../../../Experience'

function LambertMaterial(): THREE.MeshLambertMaterial[] {
  const experience = new Experience()
  const debug = experience.debug

  const debugObject = {
    color: new THREE.Color(0x06080e),
    emissiveIntensity: 0.05,
    emissive: new THREE.Color(0x070637)
  }

  let debugFolder
  if (debug.active) {
    debugFolder = debug.ui?.addFolder('Man') //.close()
  }

  const material = new THREE.MeshLambertMaterial({
    color: debugObject.color,
    emissive: debugObject.emissive,
    emissiveIntensity: debugObject.emissiveIntensity
    // metalness: debugObject.metalness,
    // roughness: debugObject.roughness,
    // envMap: resources.items.envMap as THREE.Texture
    // roughnessMap: resources.items.manRoughness as THREE.Texture,
    // map: resources.items.manColor as THREE.Texture,
    // aoMap: resources.items.manAO as THREE.Texture,
    // normalMap: resources.items.manNormal as THREE.Texture,
    // metalnessMap: resources.items.manMetallic as THREE.Texture
  })

  if (debug.active && debugFolder) {
    debugFolder.addColor(debugObject, 'color').onChange(() => {
      material.color = debugObject.color
    })
    debugFolder.addColor(debugObject, 'emissive').onChange(() => {
      material.emissive = debugObject.emissive
    })
    debugFolder
      .add(debugObject, 'emissiveIntensity')
      .min(0)
      .max(5)
      .step(0.01)
      .onChange(() => {
        material.emissiveIntensity = debugObject.emissiveIntensity
      })
  }

  return [material]
}

export default LambertMaterial
