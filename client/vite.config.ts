import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  plugins: [tailwindcss(), react(), svgr()],
});
