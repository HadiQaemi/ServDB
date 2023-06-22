/**
 * Don't touch this file. It will be regenerated by theia build.
 * To customize webpack configuration change /app/webpack.config.js
 */
// @ts-check
const path = require('path');
const yargs = require('yargs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const NativeWebpackPlugin = require('@theia/native-webpack-plugin');

const { mode } = yargs.option('mode', {
    description: "Mode to use",
    choices: ["development", "production"],
    default: "production"
}).argv;

const production = mode === 'production';

/** @type {import('webpack').EntryObject} */
const commonJsLibraries = {};
for (const [entryPointName, entryPointPath] of Object.entries({
    
    
    
    
    
})) {
    commonJsLibraries[entryPointName] = {
        import: require.resolve(entryPointPath),
        library: {
            type: 'commonjs2',
        },
    };
}

const ignoredResources = new Set();

if (process.platform !== 'win32') {
    ignoredResources.add('@vscode/windows-ca-certs');
    ignoredResources.add('@vscode/windows-ca-certs/build/Release/crypt32.node');
}

const nativePlugin = new NativeWebpackPlugin({
    out: 'native',
    trash: false,
    ripgrep: false,
    pty: false,
    nativeBindings: {
        drivelist: 'drivelist/build/Release/drivelist.node'
    }
});

/** @type {import('webpack').Configuration} */
const config = {
    mode,
    devtool: mode === 'development' ? 'source-map' : false,
    target: 'node',
    node: {
        global: false,
        __filename: false,
        __dirname: false
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib', 'backend'),
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]?[loaders]',
    },
    entry: {
        // Main entry point of the Theia application backend:
        'main': require.resolve('./src-gen/backend/main'),
        // Theia's IPC mechanism:
        'ipc-bootstrap': require.resolve('@theia/core/lib/node/messaging/ipc-bootstrap'),
        
        
                
        
        
        ...commonJsLibraries
    },
    module: {
        rules: [
            // Make sure we can still find and load our native addons.
            {
                test: /\.node$/,
                loader: 'node-loader',
                options: {
                    name: 'native/[name].[ext]'
                }
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'source-map-loader'
            },
            // jsonc-parser exposes its UMD implementation by default, which
            // confuses Webpack leading to missing js in the bundles.
            {
                test: /node_modules[\/](jsonc-parser)/,
                loader: 'umd-compat-loader'
            }
        ]
    },
    plugins: [
        // Some native dependencies need special handling
        nativePlugin,
        // Optional node dependencies can be safely ignored
        new webpack.IgnorePlugin({
            checkResource: resource => ignoredResources.has(resource)
        })
    ],
    optimization: {
        // Split and reuse code across the various entry points
        splitChunks: {
            chunks: 'all'
        },
        // Only minimize if we run webpack in production mode
        minimize: production,
        minimizer: [
            new TerserPlugin({
                exclude: /^(lib|builtins)\//
            })
        ]
    },
    ignoreWarnings: [
        // Some packages do not have source maps, that's ok
        /Failed to parse source map/,
        // Some packages use dynamic requires, we can safely ignore them (they are handled by the native webpack plugin)
        /require function is used in a way in which dependencies cannot be statically extracted/, {
            module: /yargs/
        }, {
            module: /node-pty/
        }, {
            module: /require-main-filename/
        }, {
            module: /ws/
        }, {
            module: /express/
        }, {
            module: /cross-spawn/
        }
    ]
};

module.exports = {
    config,
    nativePlugin,
    ignoredResources
};