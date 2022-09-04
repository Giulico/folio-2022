import * as THREE from 'three'
import { MeshStandardMaterial } from 'three'
import Experience from '../../../Experience'

// Shaders
import cnoise from '../../shaders/perlin.glsl?raw'

type Uniforms = {
  uTime: number
  uBigWavesElevation: number
  uBigWavesFrequency: THREE.Vector2
  uBigWavesSpeed: number
  uDepthColor: THREE.Color
  uSurfaceColor: THREE.Color
  uColorOffset: number
  uColorMultiplier: number
}

type UniformsValue = {
  [P in keyof Uniforms]: { value: Uniforms[P] }
}

function GlowMaterial(): MeshStandardMaterial[] {
  const experience = new Experience()
  const resources = experience.resources
  const time = experience.time
  const debug = experience.debug

  let debugFolder
  if (debug.active) {
    debugFolder = debug.ui?.addFolder('Man').close()
  }

  const debugObject = {
    roughness: 0.46,
    metalness: 1,
    uBigWavesElevation: 0.06,
    uBigWavesFrequency: new THREE.Vector2(0.01, 0.01),
    uBigWavesSpeed: 0.52,
    uDepthColor: new THREE.Color('#252e46'),
    uSurfaceColor: new THREE.Color('#667fa9'),
    uColorOffset: 0.48,
    uColorMultiplier: 3.85
  }

  const material = new THREE.MeshStandardMaterial({
    // color: 0xedd1ff,
    // metalness: debugObject.metalness,
    // roughness: debugObject.roughness,
    envMap: resources.items.envMap as THREE.Texture
    // roughnessMap: resources.items.manRoughness as THREE.Texture,
    // map: resources.items.manColor as THREE.Texture,
    // aoMap: resources.items.manAO as THREE.Texture,
    // normalMap: resources.items.manNormal as THREE.Texture,
    // metalnessMap: resources.items.manMetallic as THREE.Texture
  })

  const uniforms: UniformsValue = {
    uTime: { value: time.elapsed },
    uBigWavesElevation: { value: debugObject.uBigWavesElevation },
    uBigWavesFrequency: { value: debugObject.uBigWavesFrequency },
    uBigWavesSpeed: { value: debugObject.uBigWavesSpeed },
    uDepthColor: { value: debugObject.uDepthColor },
    uSurfaceColor: { value: debugObject.uSurfaceColor },
    uColorOffset: { value: debugObject.uColorOffset },
    uColorMultiplier: { value: debugObject.uColorMultiplier }
  }

  resources.items.manHeight.wrapS = THREE.RepeatWrapping
  resources.items.manHeight.wrapT = THREE.RepeatWrapping

  material.onBeforeCompile = (shader) => {
    shader.uniforms = { ...shader.uniforms, ...uniforms }

    // Add to top of vertex shader
    shader.vertexShader =
      `
        uniform float uTime;
        uniform float uBigWavesElevation;
        uniform vec2 uBigWavesFrequency;
        uniform float uBigWavesSpeed;

        // uniform float uSmallWavesElevation;
        // uniform float uSmallWavesFrequency;
        // uniform float uSmallWavesSpeed;
        // uniform float uSmallWavesIteration;

        uniform sampler2D heightMap;

        varying float vElevation;
        varying float vAmount;
        
        ${cnoise}
      ` + shader.vertexShader

    shader.vertexShader = shader.vertexShader.replace(
      /void main\(\) {/,
      (match) =>
        match +
        `
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);

          // float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) 
          //   * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed)
          //   * uBigWavesElevation;
          
          // for (float i = 1.0; i <= uSmallWavesIteration; i++) {
          //   elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
          // }

          vElevation = sin(modelPosition.z * uBigWavesFrequency.x + uTime * uBigWavesSpeed)
            * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed)
            * uBigWavesElevation;
        `
    )

    shader.fragmentShader =
      `
        uniform vec3 uDepthColor;
        uniform vec3 uSurfaceColor;

        uniform float uColorOffset;
        uniform float uColorMultiplier;

        uniform vec3 uFogColor;
        uniform float uFogNear;
        uniform float uFogFar;

        uniform sampler2D heightMap;

        varying float vElevation;
        varying float vAmount;
      ` + shader.fragmentShader

    shader.fragmentShader = shader.fragmentShader.replace(
      /vec4 diffuseColor.*;/,
      (match) =>
        match +
        `
            float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
            vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
            diffuseColor = vec4(color, 1.0);
          `
    )
  }

  if (debug.active && debugFolder) {
    debugFolder
      .add(debugObject, 'roughness')
      .min(0.01)
      .max(5)
      .step(0.01)
      .onChange(() => (material.roughness = debugObject.roughness))
    debugFolder
      .add(debugObject, 'metalness')
      .min(0.01)
      .max(1)
      .step(0.01)
      .onChange(() => (material.metalness = debugObject.metalness))
    // Waves
    debugFolder
      .add(debugObject, 'uBigWavesElevation')
      .min(0.01)
      .max(1.0)
      .step(0.01)
      .name('Big Waves Elevation')
      .onChange(() => {
        uniforms.uBigWavesElevation.value = debugObject.uBigWavesElevation
      })
    debugFolder
      .add(debugObject.uBigWavesFrequency, 'x')
      .min(0.01)
      .max(10.0)
      .step(0.01)
      .name('Big Waves Frequency x')
      .onChange(() => {
        uniforms.uBigWavesFrequency.value.x = debugObject.uBigWavesFrequency.x
      })
    debugFolder
      .add(debugObject.uBigWavesFrequency, 'y')
      .min(0.01)
      .max(10.0)
      .step(0.01)
      .name('Big Waves Frequency y')
      .onChange(() => {
        uniforms.uBigWavesFrequency.value.y = debugObject.uBigWavesFrequency.y
      })
    debugFolder
      .add(debugObject, 'uBigWavesSpeed')
      .min(0.01)
      .max(5.0)
      .step(0.01)
      .name('Big Waves Speed')
      .onChange(() => {
        uniforms.uBigWavesSpeed.value = debugObject.uBigWavesSpeed
      })
    debugFolder
      .addColor(debugObject, 'uDepthColor')
      .name('Depth Color')
      .onChange(() => {
        uniforms.uDepthColor.value.set(debugObject.uDepthColor)
      })
    debugFolder
      .addColor(debugObject, 'uSurfaceColor')
      .name('Surface Color')
      .onChange(() => {
        uniforms.uSurfaceColor.value.set(debugObject.uSurfaceColor)
      })
    debugFolder
      .add(debugObject, 'uColorOffset')
      .min(0)
      .max(1)
      .step(0.01)
      .name('Color Offset')
      .onChange(() => {
        uniforms.uColorOffset.value = debugObject.uColorOffset
      })
    debugFolder
      .add(debugObject, 'uColorMultiplier')
      .min(-10)
      .max(10)
      .step(0.01)
      .name('Color Multiplier')
      .onChange(() => {
        uniforms.uColorMultiplier.value = debugObject.uColorMultiplier
      })
  }

  time.on('tick', () => {
    if (uniforms?.uTime) {
      uniforms.uTime.value = time.clockElapsed
    }
  })

  return [material]
}

export default GlowMaterial
