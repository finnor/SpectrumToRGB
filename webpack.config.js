module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        library: "SpectrumToRGB"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
};