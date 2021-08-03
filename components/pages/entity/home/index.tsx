import react from 'react'
import { EntityMetadata } from 'dvote-js'
import { useTranslation } from 'react-i18next'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { Grid, Column } from '@components/elements/grid'
import { PageCard } from '@components/elements/cards'
import { CardImageHeader } from '@components/blocks/card/image-header'


interface IEntityViewProps {
  address: string,
  metadata: EntityMetadata
}
export const EntityView = ({ address, metadata }: IEntityViewProps) => {
  const { i18n } = useTranslation()
  const explorerUrl = `${process.env.EXPLORER_URL}/entity/${address}`

  return (
    <PageCard>
      <CardImageHeader
        title={metadata?.name.default}
        processImage={metadata?.media.header}
        // subtitle={entity?.name.default}
        entityImage={metadata.media.avatar}
      />

      <Grid>
        <Column sm={12}>
          <Typography variant={TypographyVariant.Body1}>{i18n.t('entity.home.entity_address')} </Typography>
          <Typography variant={TypographyVariant.Small}>{address}<a href={explorerUrl} target='blank'>({i18n.t('entity.home.view_in_explorer')})</a></Typography>
        </Column>
      </Grid>

      <Grid>
        <Column sm={12}>
          <Typography variant={TypographyVariant.Body1}>{i18n.t('entity.home.entity_description')}</Typography>
          <Typography variant={TypographyVariant.Small}>{metadata.description.default}</Typography>
        </Column>
      </Grid>
    </PageCard>
  )
}