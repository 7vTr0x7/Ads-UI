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
      name: "host",
      remotes: {
        ads: {
          type: "module",
          name: "ads",
          entry: "http://localhost:6001/remoteEntry.js",
        },
        products: {
          type: "module",
          name: "products",
          entry: "http://localhost:6002/remoteEntry.js",
        },
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "@apollo/client": { singleton: true },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
