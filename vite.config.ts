import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "components", replacement: "/src/components" },
      { find: "store", replacement: "/src/store/store.ts" },
      { find: "styles", replacement: "/src/styles" },
      { find: "utils", replacement: "/src/utils" },
    ],
  },
});
