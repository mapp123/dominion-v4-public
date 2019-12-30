/* eslint-disable */
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const HtmlOutputPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
let extractSass = new MiniCssExtractPlugin({
    filename: '../css/[name].css',
    chunkFilename: '[id].css'
});
const cardTest = /\.\/(.*?)\/(.*?)\.ts/;
let unknown = 0;
const chunkNames = new webpack.NamedChunksPlugin((chunk) => {
    if (chunk.name) {
        return chunk.name;
    }
    for (let m of chunk._modules) {
        if (cardTest.test(m.rawRequest)) {
            cardTest.lastIndex = 0;
            const [, set, cardName] = cardTest.exec(m.rawRequest);
            if (chunk._modules.size > 1) {
                // We have non-pulled util modules, log the extras!
                for (let p of chunk._modules) {
                    if (p !== m) {
                        console.log(`Extra module in card chunk: ${p.rawRequest}`);
                    }
                }
            }
            // uBlock Origin blocks the name Urchin.js, so we want to make sure we rename it for safety.
            return `cards/${set}/${cardName === "Urchin" ? "darkAgesUrchin": cardName}`;
        }
    }
    // Hack to return first module ID
    for (let m of chunk._modules) {
        return m.debugId;
    }
    return `unid-${unknown++}`;
});
const removeSupplyInClient = new webpack.NormalModuleReplacementPlugin(
    /server\/Supply/,
    '../client/ClientSupply.ts'
);
const removeCompromiseInClient = new webpack.NormalModuleReplacementPlugin(
    /compromise/,
    './ClientCompromise.ts'
);
let istanbul = {
    test: /\.tsx?$/,
    use: {
        loader: 'istanbul-instrumenter-loader',
        options: {
            esModules: true
        }
    },
    enforce: 'post',
    exclude: /node_modules/
};
module.exports = env => ({
    entry: {
        main: './src/client/app.tsx',
        css: './src/client/style.scss'
    },
    output: {
        filename: '[name].js',
        path: __dirname + "/dist/js",
        publicPath: "/js/"
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins: [
        extractSass,
        chunkNames,
        removeSupplyInClient,
        removeCompromiseInClient
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            env === "coverage" ? istanbul : null
        ].filter((a) => a)
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                util: {
                    test: /Texts|Util|Artifact|(?:.*?\.abstract)|Project|ClientSupply|ClientCompromise|Tracker/,
                    name: 'util',
                    chunks: 'all'
                }
            }
        }
    }
});