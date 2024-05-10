const path = require('path');

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
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
