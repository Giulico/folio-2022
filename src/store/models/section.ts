import { createModel } from "@rematch/core";
import type { RootModel } from "../models";

export const section = createModel<RootModel>()({
  state: "hero",
  reducers: {
    update(state, payload) {
      return payload;
    },
  },
});
