export type Source = {
  name: string;
  path: string | string[];
  type: string;
};

export type Sources = Source[];

const sources: Sources = [
  // {
  //   name: "environmentMapTexture",
  //   type: "hdr",
  //   path: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/empty_warehouse_01_1k.hdr",
  // },
  {
    name: "explosion",
    type: "texture",
    path: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/explosion.png",
  },
  {
    name: "manMetallic",
    type: "texture",
    path: "/textures/man/metallic.jpeg",
  },
  {
    name: "manRoughness",
    type: "texture",
    path: "/textures/man/roughness.jpeg",
  },
  {
    name: "smoke",
    type: "texture",
    path: "/textures/Smoke/smoke.png",
  },
  {
    name: "manSkin",
    type: "texture",
    path: "https://i.imgur.com/oYS135g.jpeg",
  },
  {
    name: "manSkinDisplacement",
    type: "texture",
    path: "https://i.imgur.com/L1pqRg9.jpeg",
  },
  {
    name: "manModel",
    type: "gltfModel",
    path: "/models/Man/Man5.glb",
  },
];

export default sources;
