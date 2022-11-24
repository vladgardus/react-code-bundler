import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path.plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
// (async () =>
//   await esbuild.initialize({
//     worker: true,
//     wasmURL: "https://unpkg.com/esbuild-wasm@0.15.13/esbuild.wasm",
//   }))();
let initializer = esbuild.initialize({
  worker: true,
  wasmURL: "https://unpkg.com/esbuild-wasm@0.15.13/esbuild.wasm",
});
let bundle = async (rawCode: string) => {
  await initializer;
  try {
    let res = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });
    return { code: res.outputFiles[0]?.text, err: "" };
  } catch (err) {
    if (err instanceof Error) return { code: "", err: err.message };
    else throw err;
  }
};

export default bundle;
