import React from 'react'
import { When } from 'react-if'

import { TermsLayer2Ca } from './ca'
import { TermsLayer2En } from './en'
import { TermsLayer2Es } from './es'

interface ITermsProps {
  lang: string
}

export const Terms = ({ lang }: ITermsProps) => (
  <>
    <When condition={!lang || lang === 'es'}>
      <TermsLayer2Es />
    </When>
    <When condition={lang === 'ca'}>
      <TermsLayer2Ca />
    </When>
    <When condition={lang === 'en'}>
      <TermsLayer2En />
    </When>
  </>
)
