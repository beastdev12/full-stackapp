const path = require('path');

/**
 * @type {import('next').NextConfig}
 */

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude 'fs' module from client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false
      };
    }

    // Resolve 'apexcharts' module path
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    };

    return config;
  }
};
