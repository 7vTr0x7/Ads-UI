import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [],
      },
    }),
    tailwindcss(),
    federation({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./Products": "./src/components/Products.tsx", // Expose component
      },
      shared: ["react", "react-dom", "@apollo/client"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 6002,
  },
});
