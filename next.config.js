const env = require('./env-config.js')

module.exports = {
  // Generate /dashboard/ instead of /dashboard.html
  trailingSlash: true,
  env,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module

    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    if (!isServer) {
      config.resolve.alias['pdfkit'] = 'pdfkit/js/pdfkit.standalone.js'
    }

    config.node = {...config.node, fs: 'empty'}

    return config
  }
}
