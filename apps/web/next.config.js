const path = require('node:path');
const process = require('node:process');

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
        source: "/api/v1/t2s",
        destination: "http://14.224.188.206:8502/api/v1/t2s/"//process.env.NODE_ENV === "development" ? "http://14.224.188.206:8502/api/v1/t2s/:path" : "http://localhost:8502/api/v1/t2s/:path",
      },
      {
        source: "/api/v1/t2s/:path",
        destination: "http://14.224.188.206:8502/api/v1/t2s/:path"//process.env.NODE_ENV === "development" ? "http://14.224.188.206:8502/api/v1/t2s/:path" : "http://localhost:8502/api/v1/t2s/:path",
      },
      // {
      //   source: "/app/separate/:path",
      //   destination: "http://14.224.188.206:8886/:path",
      // },
    ]
  }
};
