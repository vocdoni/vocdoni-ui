import React from 'react'
import { When } from 'react-if'

import { PrivacyLayer1Ca } from './ca'
import { PrivacyLayer1En } from './en'
import { PrivacyLayer1Es } from './es'

interface IPrivacyProps {
  lang: string
}

export const Privacy = ({ lang }: IPrivacyProps) => (
  <>
    <When condition={!lang || lang === 'es'}>
      <PrivacyLayer1Es />
    </When>
    <When condition={lang === 'ca'}>
      <PrivacyLayer1Ca />
    </When>
    <When condition={lang === 'en'}>
      <PrivacyLayer1En />
    </When>
  </>
)
