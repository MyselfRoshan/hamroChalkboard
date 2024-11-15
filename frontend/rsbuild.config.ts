// rsbuild.config.ts
import { loadEnv, mergeRsbuildConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack"

const loadEnvOptions = {
    cwd: process.cwd() + "/../",
}

const { parsed, filePaths, publicVars } = loadEnv(loadEnvOptions)
console.log("parsed", parsed, filePaths)
export default mergeRsbuildConfig({
    plugins: [pluginReact()],
    source: {
        define: {
            // only pass required env vars to frontend
            "process.env": {
                API_HOST: JSON.stringify(parsed.API_HOST),
                API_PORT: JSON.stringify(parsed.API_PORT),
                API_VERSION: JSON.stringify(parsed.API_VERSION),
                API_PREFIX: JSON.stringify(parsed.API_PREFIX),
            },
        },
    },
    tools: {
        rspack: {
            plugins: [TanStackRouterRspack()],
        },
    },
    output: {
        cssModules: {
            auto: (resource) => {
                return (
                    resource.includes(".module.") ||
                    resource.includes("shared/")
                )
            },
        },
    },
})
