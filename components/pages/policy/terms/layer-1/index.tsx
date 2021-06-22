import React from 'react'
import { When } from 'react-if'

import { TermsLayer1Ca } from './ca'
import { TermsLayer1En } from './en'
import { TermsLayer1Es } from './es'

interface ITermsProps {
  lang: string
}

export const Terms = ({ lang }: ITermsProps) => (
  <>
    <When condition={!lang || lang === 'es'}>
      <TermsLayer1Es />
    </When>
    <When condition={lang === 'ca'}>
      <TermsLayer1Ca />
    </When>
    <When condition={lang === 'en'}>
      <TermsLayer1En />
    </When>
  </>
)
