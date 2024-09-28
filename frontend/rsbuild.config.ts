// rsbuild.config.ts
import { loadEnv, mergeRsbuildConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

const loadEnvOptions = {
  cwd: process.cwd() + "/../",
  prefixes: ["PUBLIC_"],
};
const { parsed, filePaths, publicVars } = loadEnv(loadEnvOptions);
console.log("parsed", parsed, filePaths, publicVars);
export default mergeRsbuildConfig({
  plugins: [pluginReact()],
  source: {
    define: publicVars,
  },
  tools: {
    rspack: {
      plugins: [TanStackRouterRspack()],
    },
  },
});
