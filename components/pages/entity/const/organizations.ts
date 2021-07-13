import i18n from "@i18n"

export const SELECT_ORGANIZATION_TYPE = [
  {
    label: i18n.t('entity.select_non_profit'),
    value: 'non-profit'
  },
  {
    label: i18n.t('entity.select_informal_organization'),
    value: 'informal'
  },
  {
    label: i18n.t('entity.select_company'),
    value: 'company'
  },
  {
    label: i18n.t('entity.select_cooperative'),
    value: 'cooperative'
  },
  {
    label: i18n.t('entity.select_trade_union'),
    value: 'trade-union'
  },
  {
    label: i18n.t('entity.select_city_council'),
    value: 'city-council'
  },
  {
    label: i18n.t('entity.select_other_public'),
    value: 'other-public'
  },
  {
    label: i18n.t('entity.select_individual'),
    value: 'individual'
  },
  {
    label: i18n.t('entity.select_other'),
    value: 'other'
  }
]

export const SELECT_ORGANIZATION_SIZE = [
  {
    label: '1-50',
    value: 1
  },
  {
    label: '51-100',
    value: 51
  },
  {
    label: '101-500',
    value: 101
  },
  {
    label: '501-1000',
    value: 501
  },
  {
    label: '>1000',
    value: 1001
  },
]
