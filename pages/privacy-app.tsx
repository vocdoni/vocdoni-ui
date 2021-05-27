import { PageCard } from '@components/cards'
import { Privacy } from '@components/policy/privacy/layer-1'
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