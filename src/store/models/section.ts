import { createModel } from "@rematch/core";
import type { RootModel } from "../models";

export const section = createModel<RootModel>()({
  state: "titolo",
  reducers: {
    update(state, payload) {
      return payload;
    },
  },
});
