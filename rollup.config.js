import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";
import includePaths from "rollup-plugin-includepaths";

export default {
  input: "src/index.ts", // Entry point of your library
  output: {
    file: "dist/credit-card-inputs.umd.js", // Output file for UMD build
    format: "umd", // UMD format
    name: "CCI", // Global variable name in browser
    sourcemap: true, // Enable source maps for debugging
    assetFileNames: "assets/[name][extname]",
  },
  plugins: [
    nodeResolve(), // Resolve dependencies in node_modules
    commonjs(), // Convert CommonJS modules to ES6 if needed
    url({
      include: ["**/*.png", "**/*.jpg", "**/*.svg"],
      limit: 0, // Always copy assets, do not inline them as base64
      fileName: "[dirname][name][extname]", // Output path for assets
      destDir: "dist/assets", // Output directory for assets
    }),
    // Copy static assets (images, fonts, etc.)
    copy({
      targets: [
        { src: "src/assets/*", dest: "dist/assets" }, // Copy all assets to dist/assets
      ],
    }),
    typescript(), // Compile TypeScript to JavaScript
    postcss({
      extract: true, // Extract CSS to a separate file
    }),
  ],
};
