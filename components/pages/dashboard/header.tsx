import React, { useState } from 'react'
import { EntityMetadata } from 'dvote-js'
import { useTranslation } from 'react-i18next'
import { If, Then } from 'react-if'


import { FALLBACK_ACCOUNT_ICON } from '@const/account'
import { ACCOUNT_BACKUP_PATH, CREATE_PROCESS_PATH } from '@const/routes'

import { Banner } from '@components/blocks/banners'
import { Button } from '@components/elements/button'
import { Grid, Column } from '@components/elements/grid'
import { ImageContainer } from '@components/elements/images'
import { Image } from '@components/elements/image'
import { useWallet } from '@hooks/use-wallet'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'

import Modal from 'react-rainbow-components/components/Modal'
import { ConfirmModal } from '@components/blocks/confirm-modal'
import { Typography, TypographyVariant } from '@components/elements/typography'
import styled from 'styled-components'

interface IDashboardHeaderProps {
  entity?: EntityMetadata,
  hasBackup?: boolean
}

export const DashboardHeader = ({ entity, hasBackup }: IDashboardHeaderProps) => {
  const { wallet } = useWallet()
  const { i18n } = useTranslation()
  const { trackEvent } = useRudderStack()
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleRuddlestackEvent = () => {
    trackEvent(TrackEvents.PROCESS_CREATION_BUTTON_CLICKED, { entity: wallet?.address })
  }

  const createProposalButton = (
    <Button positive onClick={() => setShowConfirmModal(true)}>
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

  const zenImage = (
    <ImageContainer width="80px" height="70px">
      <img
        src="/icons/common/warning.svg"
        alt={i18n.t('dashboard.new_release_message')}
      />
    </ImageContainer>
  )

  const bannerText = (
    <Typography variant={TypographyVariant.Body2}>
      <SpacedText>{i18n.t('dashboard.new_release_message')}</SpacedText>
    </Typography>
  )

  return (
    <Grid>
      <Banner
        title={null}
        subtitle={bannerText}
        icon={zenImage}
        warning
      />

      <Banner
        title={entity?.name?.default || i18n.t("dashboard.entity")}
        subtitle={i18n.t(
          'dashboard.manage_your_community_and_schedule_new_votes'
        )}
        rightButton={createProposalButton}
        icon={accountImage}
      />

      <If condition={!hasBackup && false}>
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

      <Modal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <Grid>
          <Column sm={12}>
            <CenteredImg src='/icons/common/warning.svg' alt='warning' width="100" />
          </Column>
          <Column>
          <SpacedText><Typography variant={TypographyVariant.Body2}>{i18n.t('dashboard.new_release_message')}</Typography></SpacedText>
            <Typography variant={TypographyVariant.MediumSmall}>{i18n.t('dashboard.new_release_message2')}</Typography>
          </Column>
        </Grid>

        <Grid>
          <Column sm={12}>
            <Button
              positive
              onClick={() => setShowConfirmModal(false)}
              wide
            >{i18n.t('dashboard.understood')}</Button>
          </Column>
        </Grid>
      </Modal>
    </Grid>
  )
}

const CenteredImg = styled.img`
  margin:0px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`
const SpacedText = styled.div`
  white-space: pre-line;
`
