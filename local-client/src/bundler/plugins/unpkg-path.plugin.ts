import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      //handle root entry file on index.js
      build.onResolve({ filter: /(^index\.js$)/ }, (args: esbuild.OnResolveArgs) => {
        return { path: args.path, namespace: "a" };
      });

      //handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        return { path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href, namespace: "a" };
      });

      //handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
      });
    },
  };
};
