import path, { resolve } from "path"

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: {
                                    tailwindcss: {},
                                    autoprefixer: {},
                                },
                            },
                        },
                    },
                ],
                type: "css",
            },
        ],
    },
    resolve: {
        tsConfig: {
            configFile: path.resolve(__dirname, "./tsconfig.json"),
            references: "auto",
        },
    },
}
