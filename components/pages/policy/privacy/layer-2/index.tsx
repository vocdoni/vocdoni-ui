import React from 'react'
import { When } from 'react-if'

// import { PrivacyLayer2Ca } from './ca'
import { PrivacyLayer2En } from './en'
// import { PrivacyLayer2Es } from './es'

interface IPrivacyProps {
  lang: string
}

export const Privacy = ({ lang }: IPrivacyProps) => (
  <>
    <When condition={!lang || lang === 'es'}>
      <PrivacyLayer2En />
    </When>
    <When condition={lang === 'ca'}>
      <PrivacyLayer2En />
    </When>
    <When condition={lang === 'en'}>
      <PrivacyLayer2En />
    </When>
  </>
)
