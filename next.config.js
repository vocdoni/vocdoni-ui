const env = require('./env-config.js')

module.exports = {
  // Generate /dashboard/ instead of /dashboard.html
  trailingSlash: true,
  env,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module

    if (!isServer) {
      config.resolve.alias['pdfkit'] = 'pdfkit/js/pdfkit.standalone.js'
    }

    return config
  }
}
