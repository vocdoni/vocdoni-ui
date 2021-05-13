import React from 'react'

import i18n from '@i18n'

import { Card } from '@components/cards'
import { ImageContainer } from '@components/images'
import { SectionText, TextAlign } from '@components/text'
import { Button } from '@components/button'
import { FlexAlignItem, FlexJustifyContent } from '@components/flex'

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
