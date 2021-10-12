import React from 'react'
import { When } from 'react-if'

import { OnPagePrivacyLayer1Ca } from './ca'
import { OnPagePrivacyLayer1En } from './en'
import { OnPagePrivacyLayer1Es } from './es'

interface IPrivacyProps {
  lang: string
}

export const OnPagePrivacy = ({ lang }: IPrivacyProps) => (
  <>
    <When condition={!lang || lang === 'es'}>
      <OnPagePrivacyLayer1Es />
    </When>
    <When condition={lang === 'ca'}>
      <OnPagePrivacyLayer1Ca />
    </When>
    <When condition={lang === 'en'}>
      <OnPagePrivacyLayer1En />
    </When>
  </>
)
