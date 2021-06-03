import i18n from '@i18n'

export class NoCensusMemberError extends Error {
  constructor() {
    super(i18n.t('error.these_user_is_not_member_of_the_census'))
  }
}
