import * as THREE from 'three'
import { MeshStandardMaterial } from 'three'
import Experience from '../../../Experience'

function MagicalMarbleMaterial(): MeshStandardMaterial[] {
  const experience = new Experience()
  const resources = experience.resources
  const time = experience.time
  const debug = experience.debug

  let debugFolder
  if (debug.active) {
    debugFolder = debug.ui?.addFolder('Man')
  }

  const controllers = {
    roughness: 0.5,
    multipliers: {
      A: 0.03,
      B: 0.38
    },
    colors: {
      A: 0xffffff,
      B: 0x003994
    }
  }

  const uniforms = {
    iterations: { value: 8 },
    depth: { value: 1.9 },
    smoothing: { value: 0.2 },
    colorA: {
      value: new THREE.Color(controllers.colors.A).multiplyScalar(controllers.multipliers.A)
    },
    colorB: {
      value: new THREE.Color(controllers.colors.B).multiplyScalar(controllers.multipliers.B)
    },
    heightMap: { value: resources.items.manSkin },
    displacementMap: { value: resources.items.manSkinDisplacement },
    displacement: { value: 3.0 },
    time: { value: time.clockElapsed }
  }

  resources.items.manSkinDisplacement.wrapS = THREE.RepeatWrapping
  resources.items.manSkinDisplacement.wrapT = THREE.RepeatWrapping

  resources.items.manSkinDisplacement.minFilter = THREE.NearestFilter
  resources.items.manSkinDisplacement.minFilter = THREE.NearestFilter

  const material = new THREE.MeshStandardMaterial({
    roughness: controllers.roughness
  })

  if (debug.active && debugFolder) {
    debugFolder
      .add(controllers, 'roughness')
      .min(0.01)
      .max(1)
      .step(0.01)
      .name('Roughness')
      .onChange((v: number) => (material.roughness = v))
    debugFolder.add(uniforms.iterations, 'value').min(1).max(100).step(1).name('Iterations')
    debugFolder.add(uniforms.depth, 'value').min(0.1).max(3).step(0.1).name('Depth')
    debugFolder.add(uniforms.smoothing, 'value').min(0.1).max(3).step(0.1).name('Smoothing')
    debugFolder.add(uniforms.displacement, 'value').min(0.01).max(5).step(0.01).name('Displacement')
    debugFolder
      .addColor(controllers.colors, 'A')
      .name('Color A')
      .onChange(() => {
        uniforms.colorA.value.set(
          new THREE.Color(controllers.colors.A).multiplyScalar(controllers.multipliers.A)
        )
      })
    debugFolder
      .add(controllers.multipliers, 'A')
      .min(-2)
      .max(2)
      .step(0.01)
      .name('Multiplier A')
      .onChange(() => {
        uniforms.colorA.value.set(
          new THREE.Color(controllers.colors.A).multiplyScalar(controllers.multipliers.A)
        )
      })
    debugFolder
      .addColor(controllers.colors, 'B')
      .name('Color B')
      .onChange(() => {
        uniforms.colorB.value.set(
          new THREE.Color(controllers.colors.B).multiplyScalar(controllers.multipliers.B)
        )
      })
    debugFolder
      .add(controllers.multipliers, 'B')
      .min(-2)
      .max(2)
      .step(0.01)
      .name('Multiplier B')
      .onChange(() => {
        uniforms.colorB.value.set(
          new THREE.Color(controllers.colors.B).multiplyScalar(controllers.multipliers.B)
        )
      })
  }

  material.onBeforeCompile = (shader) => {
    shader.uniforms = { ...shader.uniforms, ...uniforms }

    // Add to top of vertex shader
    shader.vertexShader =
      `
      varying vec3 v_pos;
      varying vec3 v_dir;
    ` + shader.vertexShader

    // Assign values to varyings inside of main()
    shader.vertexShader = shader.vertexShader.replace(
      /void main\(\) {/,
      (match) =>
        match +
        `
      v_dir = position - cameraPosition; // Points from camera to vertex
      v_pos = position;
    `
    )
    // Add to top of fragment shader
    shader.fragmentShader =
      `
          #define FLIP vec2(1., -1.)

          uniform vec3 colorA;
          uniform vec3 colorB;
          uniform sampler2D heightMap;
          uniform sampler2D displacementMap;
          uniform int iterations;
          uniform float depth;
          uniform float smoothing;
          uniform float displacement;
          uniform float time;

          varying vec3 v_pos;
          varying vec3 v_dir;
        ` + shader.fragmentShader

    // Add above fragment shader main() so we can access common.glsl.js
    shader.fragmentShader = shader.fragmentShader.replace(
      /void main\(\) {/,
      (match) =>
        `
          // @param p - Point to displace
          // @param strength - How much the map can displace the point
          // @returns Point with scrolling displacement applied
          vec3 displacePoint(vec3 p, float strength) {
            vec2 uv = equirectUv(normalize(p));
            vec2 scroll = vec2(time, 0.);
            vec3 displacementA = texture(displacementMap, uv + scroll).rgb; // Upright
            vec3 displacementB = texture(displacementMap, uv * FLIP - scroll).rgb; // Upside down

            // Center the range to [-0.5, 0.5], note the range of their sum is [-1, 1]
            displacementA -= 0.5;
            displacementB -= 0.5;

            return p + strength * (displacementA + displacementB);
          }

          // * @param rayOrigin - Point on sphere
          // * @param rayDir - Normalized ray direction
          // * @returns Diffuse RGB color
          vec3 marchMarble(vec3 rayOrigin, vec3 rayDir) {
            float perIteration = 1. / float(iterations);
            vec3 deltaRay = rayDir * perIteration * depth;

            // Start at point of intersection and accumulate volume
            vec3 p = rayOrigin;
            float totalVolume = 0.;

            for (int i=0; i<iterations; ++i) {
              // Read heightmap from spherical direction of displaced ray position
              vec3 displaced = displacePoint(p, displacement);
              vec2 uv = equirectUv(normalize(displaced));
              float heightMapVal = texture(heightMap, uv).r;

              // Take a slice of the heightmap
              float height = length(p); // 1 at surface, 0 at core, assuming radius = 1
              float cutoff = 1. - float(i) * perIteration;
              float slice = smoothstep(cutoff, cutoff + smoothing, heightMapVal);

              // Accumulate the volume and advance the ray forward one step
              totalVolume += slice * perIteration;
              p += deltaRay;
            }
            return toneMapping(mix(colorA, colorB, totalVolume));
          }
        ` + match
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      /vec4 diffuseColor.*;/,
      `
          vec3 rayDir = normalize(v_dir);
          vec3 rayOrigin = v_pos;

          vec3 rgb = marchMarble(rayOrigin, rayDir);
          vec4 diffuseColor = vec4(rgb, 1.);
        `
    )
  }

  time.on('tick', () => {
    if (uniforms?.time) {
      uniforms.time.value = time.clockElapsed * 0.02
    }
  })

  return [material]
}

export default MagicalMarbleMaterial
