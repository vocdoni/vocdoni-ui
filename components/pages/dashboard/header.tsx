import React from 'react'
import { EntityMetadata } from 'dvote-js'
import { useTranslation } from 'react-i18next'
import { If, Then } from 'react-if'


import { FALLBACK_ACCOUNT_ICON } from '@const/account'
import { ACCOUNT_BACKUP_PATH, CREATE_PROCESS_PATH } from '@const/routes'

import { Banner } from '@components/blocks/banners'
import { Button } from '@components/elements/button'
import { Grid } from '@components/elements/grid'
import { ImageContainer } from '@components/elements/images'
import { Image } from '@components/elements/image'
import { useWallet } from '@hooks/use-wallet'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'

interface IDashboardHeaderProps {
  entity?: EntityMetadata,
  hasBackup?: boolean
}

export const DashboardHeader = ({ entity, hasBackup }: IDashboardHeaderProps) => {
  const { wallet } = useWallet()
  const { i18n } = useTranslation()
  const { trackEvent } = useRudderStack()

  const handleRuddlestackEvent = () => {
    trackEvent(TrackEvents.PROCESS_CREATION_BUTTON_CLICKED, { entity: wallet?.address })
  }

  const createProposalButton = (
    <Button href={CREATE_PROCESS_PATH} positive onClick={handleRuddlestackEvent}>
      {i18n.t('dashboard.create_new_proposal')}
    </Button>
  )
  const backupButton = (
    <Button
      href={ACCOUNT_BACKUP_PATH}
      negative
    >
      {i18n.t('dashboard.create_backup_now')}
    </Button>
  )

  const accountImage = (
    <ImageContainer width="50px" height="70px">
      <Image
        src={entity?.media?.avatar || FALLBACK_ACCOUNT_ICON}
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
        title={entity?.name?.default || i18n.t("dashboard.entity")}
        subtitle={i18n.t(
          'dashboard.manage_your_community_and_schedule_new_votes'
        )}
        rightButton={createProposalButton}
        icon={accountImage}
      />

      <If condition={!hasBackup}>
        <Then>
          <Banner
            title={i18n.t('dashboard.your_account_is_unsafe')}
            subtitle={i18n.t(
              'dashboard.if_you_lose_access_to_your_passphrase_you_will_not_be_able_to_manage_your_entity_anymore'
            )}
            icon={downloadImage}
            rightButton={backupButton}
            warning
          />
        </Then>
      </If>
    </Grid>
  )
}
