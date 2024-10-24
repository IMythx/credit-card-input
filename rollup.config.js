import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";

export default {
  input: "src/index.ts", // Entry point of your library
  output: {
    file: "dist/credit-card-inputs.umd.js", // Output file for UMD build
    format: "umd", // UMD format
    name: "CCI", // Global variable name in browser
    sourcemap: true, // Enable source maps for debugging
    assetFileNames: "src/assets/[name][extname]", // Ensure assets are copied to dist/assets/
  },
  plugins: [
    nodeResolve(), // Resolve dependencies in node_modules
    commonjs(), // Convert CommonJS modules to ES6 if needed
    typescript(), // Compile TypeScript to JavaScript
    postcss({
      extract: true, // Extract CSS to a separate file
    }),
    url({
      include: ["**/*.svg", "**/*.png", "**/*.jpg"], // Specify asset types to rewrite
      limit: 0, // Don't inline, always copy assets to dist folder
      fileName: "[dirname][name][extname]", // Keep the folder structure for assets
      destDir: "dist/assets", // Where to output the assets
    }),

    // Copy static assets (images, fonts, etc.)
    copy({
      targets: [
        { src: "src/assets/*", dest: "dist/assets" }, // Copy all assets to dist/assets
      ],
    }),
  ],
};
