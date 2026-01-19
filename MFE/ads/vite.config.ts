import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "ads",
      filename: "remoteEntry.js",
      exposes: {
        "./AdSlot": "./src/components/AdSlot.tsx",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "@apollo/client": { singleton: true },
      },
    }),
  ],
  server: {
    port: 6001,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
