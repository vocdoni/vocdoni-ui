import React from 'react'
import { When } from 'react-if'

import { VoterTerms1Ca } from './ca'
import { VoterTerms1En } from './en'
import { VoterTerms1Es } from './es'

interface ITermsProps {
  lang: string
}

export const VoterTerms = ({ lang }: ITermsProps) => (
  <>
    <When condition={!lang || lang === 'es'}>
      <VoterTerms1Es />
    </When>
    <When condition={lang === 'ca'}>
      <VoterTerms1Ca />
    </When>
    <When condition={lang === 'en'}>
      <VoterTerms1En />
    </When>
  </>
)
