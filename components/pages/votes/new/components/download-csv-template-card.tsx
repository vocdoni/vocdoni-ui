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
import { CsvGenerator } from '@lib/csv-generator'



export const DownloadCsvTemplateCard = () => {
  const { i18n } = useTranslation()
  const csvGenerator = new CsvGenerator(
    [i18n.t('vote.name'), i18n.t('vote.surname'), i18n.t('vote.email')],
    [
      ['John', 'Doe', 'john@doe.com'],
      ['Janine', 'Doe', 'janine@doe.com'],
    ]
  ) 

  return (
    <a
      href={csvGenerator.generateUrl()}
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
