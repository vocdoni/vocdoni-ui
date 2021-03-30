// This file is evaluated when exporting the frontend application
// The environment variabled need to be set locally on in the CI/CD console

const LANG = process.env.APP_LANG || 'en'
const DEVELOPMENT = process.env.NODE_ENV !== 'production'
const COMMIT_SHA = process.env.COMMIT_SHA || 'development'
const VOCDONI_ENVIRONMENT = process.env.VOCDONI_ENVIRONMENT || 'dev'
let bootnodes = 'https://bootnodes.vocdoni.net/gateways.json'

if (VOCDONI_ENVIRONMENT !== 'prod') {
  bootnodes = bootnodes.replace('.json', `.${VOCDONI_ENVIRONMENT}.json`)
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
}

console.log('Building the frontend with ENV:', module.exports)
