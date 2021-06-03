// This file is evaluated when exporting the frontend application
// The environment variabled need to be set locally on in the CI/CD console

const LANG = process.env.APP_LANG || 'en'
const DEVELOPMENT = process.env.NODE_ENV !== 'production'
const COMMIT_SHA = process.env.COMMIT_SHA || 'development'
const VOCDONI_ENVIRONMENT = process.env.VOCDONI_ENVIRONMENT || 'dev'
let bootnodes = 'https://bootnodes.vocdoni.net/gateways.json'
let backend = 'https://manager.vocdoni.net/api/manager'
let explorer = 'https://explorer.vote'

if (VOCDONI_ENVIRONMENT !== 'prod') {
  bootnodes = bootnodes.replace('.json', `.${VOCDONI_ENVIRONMENT}.json`)
  backend = backend.replace('manager.', `manager.${VOCDONI_ENVIRONMENT}.`)
  explorer = `https://explorer.${VOCDONI_ENVIRONMENT}.vocdoni.net/`
}

module.exports = {
  COMMIT_SHA,
  LANG,
  DEVELOPMENT,
  VOCDONI_ENVIRONMENT,
  APP_TITLE: 'Vocdoni',

  // BLOCKCHAIN
  ETH_NETWORK_ID: process.env.ETH_NETWORK_ID || 'goerli',

  // VOCHAIN
  BLOCK_TIME: process.env.BLOCK_TIME || '12',

  // GATEWAYS
  BOOTNODES_URL: process.env.BOOTNODES_URL || bootnodes,
  BACKEND_URL: process.env.BACKEND_URL || backend,
  BACKEND_PUB_KEY: process.env.BACKEND_PUB_KEY || '028b1d1380c37d114ac5a2b056d11cec76439664d00b076f9ace97adbe03da6fe1',
  EXPLORER_URL: process.env.EXPLORER_URL || explorer,
  DISCOVERY_TIMEOUT: process.env.DISCOVERY_TIMEOUT || 3000,// in milliseconds
  DISCOVERY_POOL_SIZE: process.env.DISCOVERY_POOL_SIZE || 2,// in milliseconds

  // HELPSCOUT
  HELPSCOUT_PROJECT_ID: '5f78b511-0d81-4f7d-b452-40f020f4445e',

  // FEATURES
  COLOR_PICKER: 0,
  ADVANCED_CENSUS: 0
}

console.log('Building the frontend with ENV:', module.exports)
