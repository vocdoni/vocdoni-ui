// ADMIN
export const ENTITY_SIGN_IN_PATH = '/login'
export const ENTITY_FORGOT_PASSPHRASE_PATH = '/login'
export const DASHBOARD_PATH = '/dashboard'           // TODO: entity/dashboard
export const PAGE_ENTITY = '/entity/#/{entityId}'
export const EDIT_ENTITY = '/entity/edit'
export const CREATE_ACCOUNT_PATH = '/entity/new'     // TODO: entity/new
export const CREATE_PROCESS_PATH = '/votes/new' // TODO: entity/votes/new
export const SHOW_PROCESS_PATH = '/votes/show' // TODO: entity/votes/show
export const ACCOUNT_BACKUP_PATH = '/entity/backup'
export const ACCOUNT_IMPORT_PATH = '/entity/import'
export const ACCOUNT_RECOVER_PATH = '/entity/recover'
export const ACCOUNT_BRANDING = '/entity/branding'
// VOTER
export const VOTING_AUTH_FORM_PATH = '/pub/votes/auth/form/#/{processId}' // + processId
export const VOTING_AUTH_MNEMONIC_PATH = '/pub/votes/auth/mnemonic/#/{processId}' // + processId
export const VOTING_AUTH_LINK_PATH = '/pub/votes/auth/link/#/{processId}/{key}' // + processId + key
export const VOTING_PATH = '/pub/votes' // + processId

// GENERAL
// export const PRICING_PATH = '/pricing'
// export const ABOUT_PATH = '/about'
// export const TERMS_PATH = 'https://aragon.org/terms-and-conditions'
export const TERMS_PATH = '/terms'
export const PRIVACY_PATH = "/privacy"
export const APP_PRIVACY_PATH = "/app-privacy"
export const REGSITRY_PATH = "/registry"
export const DATA_POLICY_PATH = "/data"
export const COOKIES_PATH = "/cookies"
export const PRICING_PAGE = "/pricing"
export const PAYMENT_PAGE = "/payment?product_id={productId}&price_id={priceId}&quantity={quantity}"
export const PAYMENT_SUCCESS_PAGE = '/payment/success'
// export const PRIVACY_PATH = 'https://aragon.org/privacy-policy'

export const PATH_WITHOUT_COOKIES = [
  new RegExp('/pub/votes','g')
]