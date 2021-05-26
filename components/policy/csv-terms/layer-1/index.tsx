import React from 'react'
import { When } from 'react-if'

import { CsvTerms1Ca } from './ca'
import { CsvTerms1En } from './en'
import { CsvTerms1Es } from './es'

interface ITermsProps {
  lang: string
}

export const CsvTerms = ({ lang }: ITermsProps) => (
  <>
    <When condition={!lang || lang === 'es'}>
      <CsvTerms1Es />
    </When>
    <When condition={lang === 'ca'}>
      <CsvTerms1Ca />
    </When>
    <When condition={lang === 'en'}>
      <CsvTerms1En />
    </When>
  </>
)
