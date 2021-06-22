import React from 'react'
import { When } from 'react-if'

// import { TermsLayer2Ca } from './ca'
import { TermsLayer2En } from './en'
// import { TermsLayer2Es } from './es'

interface ITermsProps {
  lang: string
}

export const Terms = ({ lang }: ITermsProps) => (
  <>
     <When condition={!lang || lang === 'en'}>
      <TermsLayer2En />
    </When>
    <When condition={lang === 'es'}>
      <TermsLayer2En />
    </When>
    <When condition={lang === 'ca'}>
      <TermsLayer2En />
    </When>

  </>
)
