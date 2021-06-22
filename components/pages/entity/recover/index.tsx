import React, { useState } from 'react'
import styled from 'styled-components'
import { AccountBackup, WalletBackup } from 'dvote-js'

import i18n from '@i18n'

import { colors } from 'theme/colors'

import { SectionText, TextSize } from '@components/elements/text'

import { Button } from '@components/elements/button'

import { BackupFileSelector } from '../components/backup-file-selector'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'

import { AccountBackupPageCard } from '../components/page-card'

interface IAccountRecoveryViewProps {
  onUploadFile: (wallet: WalletBackup, backupBytes: Uint8Array) => void
}

export const AccountRecoveryView = ({onUploadFile}: IAccountRecoveryViewProps) => {
  const [accountBackupBytes, setAccountBackupBytes] = useState<Uint8Array>(null)
  const [accountBackup, setAccountBackup] = useState<WalletBackup>(null)

  const handleOnBackupUpload = (uploadedBackup: Uint8Array) => {
    const parsedBackup = AccountBackup.parse(uploadedBackup)

    setAccountBackup(parsedBackup)
    setAccountBackupBytes(uploadedBackup)
  }

  const handleCleanFile = () => {
    setAccountBackup(null)
  }
  const handleContinue = () => {
    onUploadFile(accountBackup, accountBackupBytes)
  }

  return (
    <AccountBackupPageCard
      title={i18n.t('recover.reset_your_passphrase')}
      subtitle={i18n.t('recover.drag_a_vocdoni_backup_file')}
    >
      <MaxWidth width={600}>
        <BlockContainer>
          <SectionText size={TextSize.Big} color={colors.blueText}>
            {i18n.t('recover.select_the_backup_file')}
          </SectionText>

          <SectionText color={colors.lightText}>
            {i18n.t(
              'recover.drag_the_file_that_you_download_when_you_downloaded_your_account_backup'
            )}
          </SectionText>
        </BlockContainer>
        
        <BlockContainer>
          <BackupFileSelector onBackupLoad={handleOnBackupUpload} onCleanFile={handleCleanFile}/>
        </BlockContainer>

        <FlexContainer justify={FlexJustifyContent.End}>
          <Button
            positive
            disabled={!accountBackup}
            onClick={handleContinue}
          >
            {i18n.t('recover.continue')}
          </Button>
        </FlexContainer>
      </MaxWidth>
    </AccountBackupPageCard>
  )
}

const MaxWidth = styled.div<{ width: number }>`
  margin-left: auto;
  margin-right: auto;
  max-width: ${(props) => props.width + 'px'};
`

const BlockContainer = styled.div`
  margin-bottom: 20px;
`
