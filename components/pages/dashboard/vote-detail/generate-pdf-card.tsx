import React from 'react'

import i18n from '@i18n'

import { Card } from '@components/elements/cards'
import { ImageContainer } from '@components/elements/images'
import { SectionText, TextAlign } from '@components/elements/text'
import { Button } from '@components/elements/button'
import { FlexAlignItem, FlexJustifyContent } from '@components/elements/flex'

interface IGeneratePdfCardProps {
  onClick: () => void
}

export const GeneratePdfCard = ({ onClick }: IGeneratePdfCardProps) => (
  <Card>
    <ImageContainer
      width="60px"
      height="90px"
      justify={FlexJustifyContent.Center}
      alignItem={FlexAlignItem.Center}
    >
      <img src="/images/dashboard/pdf.png"></img>
    </ImageContainer>

    <SectionText align={TextAlign.Center}>
      {i18n.t('vote_detail.generate_pdf_with_results')}
    </SectionText>

    <Button onClick={onClick} wide positive disabled={true}>
      {i18n.t('vote_detail.generate_pdf_coming_soon')}
    </Button>
  </Card>
)
