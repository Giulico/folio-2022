export type Source = {
  name: string
  path: string | string[]
  type: string
}

export type Sources = Source[]

const sources: Sources = [
  // {
  //   name: "environmentMapTexture",
  //   type: "hdr",
  //   path: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/empty_warehouse_01_1k.hdr",
  // },
  {
    name: 'envMap',
    type: 'cubeTexture',
    path: [
      '/textures/env/3/nx.jpg',
      '/textures/env/3/px.jpg',
      '/textures/env/3/ny.jpg',
      '/textures/env/3/py.jpg',
      '/textures/env/3/nz.jpg',
      '/textures/env/3/pz.jpg'
    ]
  },
  {
    name: 'manMetallic',
    type: 'texture',
    path: '/textures/man/metallic.jpeg'
  },
  {
    name: 'manRoughness',
    type: 'texture',
    path: '/textures/man/roughness.jpeg'
  },
  {
    name: 'manSkin',
    type: 'texture',
    path: 'https://i.imgur.com/oYS135g.jpeg'
  },
  {
    name: 'manSkinDisplacement',
    type: 'texture',
    path: 'https://i.imgur.com/L1pqRg9.jpeg'
  },
  {
    name: 'manModel',
    type: 'gltfModel',
    path: '/models/Man/Man6.glb'
  },
  {
    name: 'noise',
    type: 'texture',
    path: '/textures/noise/noise.jpeg'
  }
]

export default sources
