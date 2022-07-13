import { Models } from "@rematch/core";

// Models
import { app } from "./models/app";
import { scroll } from "./models/scroll";
import { section } from "./models/section";
import { sizes } from "./models/sizes";

export interface RootModel extends Models<RootModel> {
  app: typeof app;
  scroll: typeof scroll;
  section: typeof section;
  sizes: typeof sizes;
}

export const models: RootModel = { app, scroll, section, sizes };
