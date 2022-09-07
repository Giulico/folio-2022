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
  // const debug = experience.debug
  window.store.subscribe(updateAppReady)

  const uniforms = {
    time: { value: time.clockElapsed },
    outline: { value: resources.items.manVibrantSkin }
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

  return [material]
}

export default Vibrant
