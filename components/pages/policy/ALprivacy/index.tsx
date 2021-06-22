import React from 'react'
import { When } from 'react-if'

// import { ALPrivacyCa } from './ca'
import { ALPrivacyEn } from './en'
// import { ALPrivacyEs } from './es'

interface IPrivacyProps {
  lang: string
}

export const ALPrivacy = ({ lang }: IPrivacyProps) => (
  <>
    <When condition={!lang || lang === 'es'}>
      <ALPrivacyEn />
    </When>
    <When condition={lang === 'ca'}>
      <ALPrivacyEn />
    </When>
    <When condition={lang === 'en'}>
      <ALPrivacyEn />
    </When>
  </>
)
