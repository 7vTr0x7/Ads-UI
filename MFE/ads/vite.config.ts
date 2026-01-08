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
      name: "ads",
      filename: "remoteEntry.js",
      exposes: {
        "./AdSlot": "./src/components/AdSlot.tsx", // Expose component
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
    port: 6001, // Remote runs on port 5001
  },
});
