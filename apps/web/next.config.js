const path = require('node:path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  // output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    outputFileTracingRoot: path.resolve(__dirname, "../../"),
    esmExternals: "loose", // required for the canvas to work
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required for the canvas to work
    return config;
  },

  images: {
    domains: ["localhost", "api.connectedbrain.com.vn"],
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/s2t",
        destination: "http://localhost:8502/api/v1/s2t",
      },
    ]
  }
};
