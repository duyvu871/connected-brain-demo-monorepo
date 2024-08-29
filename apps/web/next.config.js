/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    esmExternals: "loose", // required for the canvas to work
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required for the canvas to work
    return config;
  },
};
