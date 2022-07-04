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
    path: "/models/Man/Man4.glb",
  },
];

export default sources;
