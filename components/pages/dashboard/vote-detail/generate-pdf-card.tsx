import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@components/elements/cards'
import { ImageContainer } from '@components/elements/images'
import { SectionText, TextAlign } from '@components/elements/text'
import { Button } from '@components/elements/button'
import { FlexAlignItem, FlexJustifyContent } from '@components/elements/flex'
import { DigestedProcessResults, EntityMetadata, ProcessDetails } from 'dvote-js'
import { ResultPdfGenerator } from '@lib/result-pdf-generator'

interface IGeneratePdfCardProps {
  process: ProcessDetails
  entityMetadata: EntityMetadata
  results: DigestedProcessResults
}

export const GeneratePdfCard = ({ process, results, entityMetadata }: IGeneratePdfCardProps) => {
  const { i18n } = useTranslation()
  const onClickHandler = () => {
    const resultPdfGenerator = new ResultPdfGenerator({process: process, processResults: results})

    const linkElement = document.createElement('a')

    resultPdfGenerator.generatePdfUrl()
      .then(pdfLink => {
        linkElement.setAttribute('href', pdfLink)
        linkElement.setAttribute('download', `${entityMetadata.name.default}_${process.metadata.title.default}_${(new Date()).toISOString().split('T')[0]}.pdf`)
        linkElement.click()
      })
  }

  return (
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

      <Button onClick={onClickHandler} wide positive>
        {i18n.t('vote_detail.generate_pdf')}
      </Button>

    </Card>
  )
}
