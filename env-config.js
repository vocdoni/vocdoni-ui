// This file is evaluated when exporting the frontend application
// The environment variabled need to be set locally on in the CI/CD console

const LANG = process.env.APP_LANG || 'ca'
const DEVELOPMENT = process.env.NODE_ENV !== 'production'
const COMMIT_SHA = process.env.COMMIT_SHA || 'development'
const VOCDONI_ENVIRONMENT = process.env.VOCDONI_ENVIRONMENT || 'prod'
let bootnodes = 'https://bootnodes.vocdoni.net/gateways.azeno.priv.json'
let backend = 'https://manager.vocdoni.net/api/manager'
let explorer = 'https://explorer.vote'

switch (VOCDONI_ENVIRONMENT) {
  case 'dev':
    explorer = `https://explorer.${VOCDONI_ENVIRONMENT}.vocdoni.net`
    break
  case 'stg':
    explorer = `https://${VOCDONI_ENVIRONMENT}.explorer.vote`
    break
}

if (VOCDONI_ENVIRONMENT !== 'prod') {
  bootnodes = bootnodes.replace('.json', `.${VOCDONI_ENVIRONMENT}.json`)
  backend = backend.replace('manager.', `manager.${VOCDONI_ENVIRONMENT}.`)
  explorer = `https://explorer.${VOCDONI_ENVIRONMENT}.vocdoni.net`
} else {
  backend = 'https://backend.azeno.vocdoni.net/api/manager'
}

module.exports = {
  COMMIT_SHA,
  LANG,
  DEVELOPMENT,
  VOCDONI_ENVIRONMENT,
  APP_TITLE: 'Vocdoni',

  // BLOCKCHAIN
  ETH_NETWORK_ID: process.env.ETH_NETWORK_ID || 'xdai',

  // VOCHAIN
  BLOCK_TIME: process.env.BLOCK_TIME || '12',

  // GATEWAYS
  BOOTNODES_URL: process.env.BOOTNODES_URL || bootnodes,
  BACKEND_URL: process.env.BACKEND_URL || backend,
  BACKEND_PUB_KEY: process.env.BACKEND_PUB_KEY || '03cd13285ea116b9093a47364b29ddb09eccf50aa2f0112b6084a0b10943964d4e',
  EXPLORER_URL: process.env.EXPLORER_URL || explorer,
  DISCOVERY_TIMEOUT: process.env.DISCOVERY_TIMEOUT || 3000,// in milliseconds
  DISCOVERY_POOL_SIZE: process.env.DISCOVERY_POOL_SIZE || 1,// in milliseconds

  // HELPSCOUT
  HELPSCOUT_PROJECT_ID: '5f78b511-0d81-4f7d-b452-40f020f4445e',

  // FEATURES
  COLOR_PICKER: process.env.COLOR_PICKER || 0,
  ADVANCED_CENSUS: process.env.ADVANCED_CENSUS || 0,
  ANALYTICS_KEY:  process.env.ANALYTICS_KEY,
  ANALYTICS_URL:  process.env.ANALYTICS_URL,
  // CSP_URL: process.env.CSP_URL || 'https://csp-sms.vocdoni.net/',
  // CSP_PUB_KEY: process.env.CSP_PUB_KEY || '03e349c2a4622bd56238616f8160bfeb6b053f260f1a541f72015e0e261ac68d5c',
  // CSP_API_VERSION: process.env.CSP_API_VERSION || 'v1',

  ARCHIVE_IPNS_ID: process.env.ARCHIVE_IPNS_ID || 'k2k4r8n84llyqk6u0sifx9g3vkmtmuba3qf3yxv1qcr6if78lyhtuwye',
}

console.log('Building the frontend with ENV:', module.exports)
