import { PageCard } from '@components/elements/cards'
import { Privacy } from '@components/pages/policy/privacy/layer-2'
import i18n from '@i18n'
import React from 'react'

export const PrivacyApp = () => {
  const lang = i18n.language

  return (
    <PageCard>
      <Privacy lang={lang}/>
    </PageCard >
  )
}

export default PrivacyApp
