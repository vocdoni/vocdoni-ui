import i18n from "@i18n"

export const SELECT_ORGANIZATION_TYPE = [
  {
    label: i18n.t('entity.select_non_profit'),
    value: 'non-profit-organization'
  },
  {
    label: i18n.t('entity.select_informatial_organization'),
    value: 'informational-organization'
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
    value: '1-50'
  },
  {
    label: '51-100',
    value: '51-100'
  },
  {
    label: '101-500',
    value: '101-500'
  },
  {
    label: '501-1000',
    value: '501-1000'
  },
  {
    label: '>1000',
    value: '>1000'
  },
]