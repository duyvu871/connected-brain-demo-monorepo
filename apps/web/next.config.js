/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.worker\.ts$/,
        loader: 'worker-loader',
        options: {
          filename: 'static/[name].worker.js',
          publicPath: '/_next/static/',
        },
      });
    }

    return config;
  },
};
