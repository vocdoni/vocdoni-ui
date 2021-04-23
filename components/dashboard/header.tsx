import React from 'react'
import styled from 'styled-components'

import i18n from '../../i18n'
import { FALLBACK_ACCOUNT_ICON } from '../../const/account'
import { CREATE_PROPOSAL_PATH } from '../../const/routes'
import { Account } from '../../lib/types'

import { Banner } from '../banners'
import { Button } from '../button'
import { Grid } from '../grid'
import { Unless } from 'react-if'

interface IDashboardHeaderProps {
  account?: Account
}

export const DashboardHeader = ({ account }: IDashboardHeaderProps) => {
  const createProposalButton = (
    <Button href={CREATE_PROPOSAL_PATH} positive>
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
    <ImageContainer>
      <img
        src={account?.pending?.metadata?.media.avatar || FALLBACK_ACCOUNT_ICON}
        alt={i18n.t('dashboard.company_logo')}
      />
    </ImageContainer>
  )
  const downloadImage = (
    <ImageContainer>
      <img
        src="/images/dashboard/download.svg"
        alt={i18n.t('dashboard.company_logo')}
      />
    </ImageContainer>
  )

  return (
    <Grid>
      <Banner
        title={account?.name}
        subtitle={i18n.t(
          'dashboard.manage_your_community_and_schedule_new_votes'
        )}
        rightButton={createProposalButton}
        icon={accountImage}
      />

      <Unless condition={account?.backupMnemonic}>
        <Banner
          title={i18n.t('dashboard.your_account_is_unsafe')}
          subtitle={i18n.t(
            'dashboard.if_you_lose_access_to_your_passphrase_you_will_not_be_able_to_manage_your_entity_anymore'
          )}
          icon={downloadImage}
          rightButton={backupButton}
          warning
        />
      </Unless>
    </Grid>
  )
}

const ImageContainer = styled.div`
  & > img {
    max-width: 50px;
    max-height: 70px;
  }
`
