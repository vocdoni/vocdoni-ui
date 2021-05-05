import React from 'react'
import { EntityMetadata } from 'dvote-js'
import { If } from 'react-if'

import i18n from '@i18n'

import { FALLBACK_ACCOUNT_ICON } from '@const/account'
import { CREATE_PROCESS_PATH } from '@const/routes'

import { Banner } from '@components/banners'
import { Button } from '@components/button'
import { Grid } from '@components/grid'
import { ImageContainer } from '@components/images'
import { Image } from '@components/common/image'

interface IDashboardHeaderProps {
  entity?: EntityMetadata,
  hasBackup?: boolean 
}

export const DashboardHeader = ({ entity, hasBackup }: IDashboardHeaderProps) => {
  const createProposalButton = (
    <Button href={CREATE_PROCESS_PATH} positive>
      {i18n.t('dashboard.create_new_proposal')}
    </Button>
  )
  const backupButton = (
    <Button
      onClick={() => {
        console.log('doing backup')
      }}
      disabled={true}
      negative
    >
      {i18n.t('dashboard.create_backup_now')}
    </Button>
  )

  const accountImage = (
    <ImageContainer width="50px" height="70px">
      <Image
        src={entity?.media.avatar || FALLBACK_ACCOUNT_ICON}
        alt={i18n.t('dashboard.company_logo')}
      />
    </ImageContainer>
  )
  const downloadImage = (
    <ImageContainer width="50px" height="70px">
      <img
        src="/images/dashboard/download.svg"
        alt={i18n.t('dashboard.company_logo')}
      />
    </ImageContainer>
  )

  return (
    <Grid>
      <Banner
        title={entity?.name.default}
        subtitle={i18n.t(
          'dashboard.manage_your_community_and_schedule_new_votes'
        )}
        rightButton={createProposalButton}
        icon={accountImage}
      />

      <If condition={!hasBackup}>
        <Banner
          title={i18n.t('dashboard.your_account_is_unsafe')}
          subtitle={i18n.t(
            'dashboard.if_you_lose_access_to_your_passphrase_you_will_not_be_able_to_manage_your_entity_anymore'
          )}
          icon={downloadImage}
          rightButton={backupButton}
          warning
        />
      </If>
    </Grid>
  )
}