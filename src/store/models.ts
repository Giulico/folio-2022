import { Models } from "@rematch/core";

// Models
import { section } from "./models/section";
import { sizes } from "./models/sizes";

export interface RootModel extends Models<RootModel> {
  section: typeof section;
  sizes: typeof sizes;
}

export const models: RootModel = { section, sizes };
