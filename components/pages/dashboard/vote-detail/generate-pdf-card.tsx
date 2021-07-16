import React from 'react'

import i18n from '@i18n'

import { Card } from '@components/elements/cards'
import { ImageContainer } from '@components/elements/images'
import { SectionText, TextAlign } from '@components/elements/text'
import { Button } from '@components/elements/button'
import { FlexAlignItem, FlexJustifyContent } from '@components/elements/flex'
import { DigestedProcessResults, IProcessDetails } from 'dvote-js'
import { useRef } from 'react'
import { ResultPdfGenerator } from '@lib/result-pdf-generator'

interface IGeneratePdfCardProps {
  process: IProcessDetails
  results: DigestedProcessResults
}

export const GeneratePdfCard = ({ process, results }: IGeneratePdfCardProps) => {
  const onClickHandler = () => {
    const resultPdfGenerator = new ResultPdfGenerator({process: process, processResults: results})

    const linkElement = document.createElement('a')

    resultPdfGenerator.generatePdfUrl()
      .then(pdfLink => {
        linkElement.setAttribute('href', pdfLink)
        linkElement.setAttribute('download', `sumary.pdf`)
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
