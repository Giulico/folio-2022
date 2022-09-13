import * as THREE from 'three'
import Experience from '../../../Experience'

// SHaders
import fragmentShader from '../../shaders/man/Vibrant/fragment'
import vertexShader from '../../shaders/man/Vibrant/vertex'

let appReady = false

function updateAppReady() {
  const state = window.store.getState()
  if (state.app.ready && !appReady) {
    appReady = true
  }
}

function Vibrant(): THREE.ShaderMaterial[] {
  const experience = new Experience()
  const resources = experience.resources
  const time = experience.time
  const debug = experience.debug

  let debugFolder
  if (debug.active) {
    debugFolder = debug.ui?.addFolder('Man')
  }

  // const debug = experience.debug
  window.store.subscribe(updateAppReady)

  const uniforms = {
    time: { value: time.clockElapsed },
    outline: { value: resources.items.manVibrantSkin },
    fresnelMax: { value: 1.9 },
    fresnelMultiplier: { value: 1.25 }
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  })

  time.on('tick', () => {
    if (appReady) {
      material.uniforms.time.value = time.clockElapsed
    }
  })

  if (debug.active && debugFolder) {
    debugFolder.add(uniforms.fresnelMax, 'value').min(1).max(10).step(0.01).name('Fresnel Max')
    debugFolder
      .add(uniforms.fresnelMultiplier, 'value')
      .min(1)
      .max(10)
      .step(0.01)
      .name('Fresnel Multiplier')
  }
  return [material]
}

export default Vibrant
