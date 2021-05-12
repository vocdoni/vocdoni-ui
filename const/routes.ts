// ADMIN
export const ENTITY_SIGN_IN_PATH = '/login'
export const ENTITY_FORGOT_PASSPHRASE_PATH = '/login'
export const DASHBOARD_PATH = '/dashboard'           // TODO: entity/dashboard
export const CREATE_ACCOUNT_PATH = '/entity/new'     // TODO: entity/new
export const CREATE_PROCESS_PATH = '/votes/new' // TODO: entity/votes/new
export const SHOW_PROCESS_PATH = '/votes/show' // TODO: entity/votes/show
export const ACCOUNT_BACKUP_PATH = '/entity/backup'
export const ACCOUNT_IMPORT_PATH = '/entity/import'
export const ACCOUNT_RECOVER_PATH = '/entity/recover'

// VOTER
export const VOTING_AUTH_FORM_PATH = '/pub/votes/auth/form#/{processId}' // + processId
export const VOTING_AUTH_LINK_PATH = '/pub/votes/auth/link' // + processId + key
export const VOTING_PATH = '/pub/votes' // + processId

// GENERAL
export const PRICING_PATH = '/pricing'
export const ABOUT_PATH = '/about'
