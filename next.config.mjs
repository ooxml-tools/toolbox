import MonacoEditorWebpackPlugin from 'monaco-editor-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/toolbox',
    webpack: (config, options) => {
        // See <https://github.com/wojtekmaj/react-pdf/issues/1824>
        config.optimization.minimize = false
        if (!options.isServer) {
            config.plugins.push(
                new MonacoEditorWebpackPlugin({
                    languages: ["xml"],
                    filename: "static/[name].worker.js",
                })
            );
        }
        return config;
      },
};

export default nextConfig;
