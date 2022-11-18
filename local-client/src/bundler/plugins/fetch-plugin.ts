import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "npmfilecache",
});
export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup: (build: esbuild.PluginBuild) => {
      build.onLoad({ filter: /^index\.js$/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        let cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        if (cachedResult) return cachedResult;
      });

      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, "\\'");
        const contents = `
                const style = document.createElement('style');
                style.innerText = '${escaped}';
                document.head.appendChild(style);
                `;
        let result = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        } as esbuild.OnLoadResult;
        await fileCache.setItem(args.path, result);
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);
        let result = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        } as esbuild.OnLoadResult;
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
