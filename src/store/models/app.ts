import { createModel } from "@rematch/core";
import type { RootModel } from "../models";

export const app = createModel<RootModel>()({
  state: {
    ready: false,
    loadingProgress: 0,
  },
  reducers: {
    setReady(state) {
      return {
        ...state,
        ready: true,
      };
    },
    setLoadingProgress(state, payload) {
      return {
        ...state,
        loadingProgress: payload,
      };
    },
  },
});
