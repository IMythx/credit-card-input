import esbuild from "esbuild";
import { umdWrapper } from "esbuild-plugin-umd-wrapper";
import metaUrlPlugin from "@chialab/esbuild-plugin-meta-url";

// Common esbuild options for both UMD and ESM
const commonOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: false,
  minify: true, // Minifies the output
  target: "esnext",
  loader: {
    ".svg": "file", // Load .svg files as assets
    ".png": "file", // Load .png files as assets
    ".jpg": "file", // Load .jpg files as assets
    ".css": "file", // Load .css files as assets
  },
  plugins: [
    umdWrapper(
      { libraryName: "credit-card-inputs", globalIdentifier: "CCI" },
      metaUrlPlugin()
    ),
  ],
};

// Build UMD version
esbuild
  .build({
    ...commonOptions,
    format: "umd",
    outfile: "dist/credit-card-inputs.umd.js",
  })
  .catch(() => process.exit(1));
