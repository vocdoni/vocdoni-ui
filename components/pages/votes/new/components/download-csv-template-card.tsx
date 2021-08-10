import React from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@components/elements/cards'
import {
  LinkTarget,
} from '@components/elements/button'
import { FlexContainer } from '@components/elements/flex'
import { ImageContainer } from '@components/elements/images'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { Grid } from '@components/elements/grid'

interface iCsvParams {
  titles: string[]
  fields: string[][]
}

export const DownloadCsvTemplateCard = () => {
  const { i18n } = useTranslation()
  const generateCsvExample = (csvParams: iCsvParams): string => {
    let binaryData = 'data:application/csv,'

    for (let index in csvParams.titles) {
      let separator = '%2C'

      if (parseInt(index) + 1 === csvParams.titles.length) {
        separator = '%0A'
      }

      binaryData += `${csvParams.titles[index]}${separator}`
    }

    for (let rowIndex = 0; rowIndex < csvParams.fields.length; ++rowIndex) {
      let row = csvParams.fields[rowIndex]

      for (let fieldIndex = 0; fieldIndex < row.length; ++fieldIndex) {
        let separator = '%2C'

        if (fieldIndex + 1 === row.length) {
          separator = '%0A'
        }

        binaryData += `${row[fieldIndex]}${separator}`
      }
    }

    return binaryData
  }
  const downloadContent = generateCsvExample({
    titles: [i18n.t('vote.name'), i18n.t('vote.surname'), i18n.t('vote.email')],
    fields: [
      ['John', 'Doe', 'john@doe.com'],
      ['Janine', 'Doe', 'janine@doe.com'],
    ],
  })

  return (
    <a
      href={downloadContent}
      download="template-file.csv"
      target={LinkTarget.Blank}
    >
      <Grid>
        <Card border sm={12}>
          <FlexContainer>
            <ImageContainer width="40px">
              <img
                src="/images/common/download.svg"
                alt={i18n.t('vote.download_icon_alt')}
              />
            </ImageContainer>
            <div>
              <Typography variant={TypographyVariant.Body1} margin="0 0 0 20px">
                {i18n.t('vote.download_template')}
              </Typography>
              <Typography
                variant={TypographyVariant.Small}
                margin="0 0 0 20px"
                color="lightText"
              >
                {i18n.t(
                  'vote.this_is_a_template_file_that_you_can_use_to_create_census'
                )}
              </Typography>
            </div>
          </FlexContainer>
        </Card>
      </Grid>
    </a>
  )
}
