import React, { useState } from 'react'
import styled from 'styled-components'
import { AccountBackup, Symmetric, WalletBackup } from 'dvote-js'

import i18n from '@i18n'

import { useWallet } from '@hooks/use-wallet'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useMessageAlert } from '@hooks/message-alert'

import { Button } from '@components/button'
import { SectionText, TextSize } from '@components/text'
import { Input } from '@components/inputs'

import { BackupFileSelector } from '../components/backup-file-selector'
import { AccountBackupPageCard } from '../components/page-card'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/flex'
import { colors } from 'theme/colors'
import { Checkbox } from '@components/checkbox'
import { Label } from '@components/label'
import { InvalidPassphraseError } from '@lib/validators/errors/invalid-passphrase-error'
import { FormGroup, InputFormGroup } from '@components/form'

interface IAccountImportViewProps {
  onImportedAccount: () => void
}

export const AccountImportView = ({
  onImportedAccount,
}: IAccountImportViewProps) => {
  const [backup, setBackup] = useState<WalletBackup>(null)
  const [passphrase, setPassphrase] = useState<string>(null)
  const [ack, setAck] = useState(false)
  const [invalidPassphrase, setInvalidPassphrase] = useState<string>()
  const { restoreEncryptedWallet } = useWallet()
  const { dbAccounts, addDbAccount } = useDbAccounts()

  const isCompleted = passphrase && backup && ack

  const handleOnBackupUpload = (uploadedBackup: Uint8Array) => {
    setBackup(AccountBackup.parse(uploadedBackup))
  }

  const onContinue = () => {
    try {
      // Restore wallet
      const buffer = Buffer.from(backup.wallet.encryptedMnemonic)
      const encryptedMnemonic = buffer.toString('base64')
      const wallet = restoreEncryptedWallet(
        encryptedMnemonic,
        backup.wallet.hdPath,
        passphrase
      )

      // Add account if not exists
      const account = dbAccounts.find((acc) => acc.address == wallet.address)
      if (!account)
        addDbAccount({
          name: backup.name,
          address: wallet.address,
          encryptedMnemonic: Symmetric.encryptString(
            wallet.mnemonic.phrase,
            passphrase
          ),
          hdPath: wallet.mnemonic.path,
          locale: backup.wallet.locale,
        })

      onImportedAccount()
    } catch (error) {
      if (error instanceof InvalidPassphraseError) {
        setInvalidPassphrase(error.message)
      }
    }
  }

  return (
    <AccountBackupPageCard
      title={i18n.t('import.import_an_account')}
      subtitle={i18n.t('import.drag_a_vocdoni_backup_file')}
    >
      <MaxWidth width={600}>
        <SectionText size={TextSize.Big} color={colors.blueText}>
          {i18n.t('import.set_the_backup_file')}
        </SectionText>
        <BlockContainer>
          <BackupFileSelector onBackupLoad={handleOnBackupUpload} />

          <SectionText size={TextSize.Small} color={colors.lightText}>
            {i18n.t('import.credentials_explanation')}
          </SectionText>
        </BlockContainer>

        <BlockContainer>
          {/* <SectionText size={TextSize.Big} color={colors.blueText}>
            {i18n.t('import.passphrase')}
          </SectionText> */}
          <InputFormGroup
            title={i18n.t('import.passphrase')}
            type="password"
            error={invalidPassphrase}
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />

          <DescriptionContainer hasError={!!invalidPassphrase}>
            <SectionText size={TextSize.Small} color={colors.lightText}>
              {i18n.t('import.confirm_your_passphrase')}
            </SectionText>
          </DescriptionContainer>
        </BlockContainer>

        <BlockContainer>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            <Checkbox
              id="accept-terms"
              checked={ack}
              onChange={(ack: boolean) => setAck(ack)}
            />

            <Label htmlFor="accept-terms" color={colors.lightText}>
              {i18n.t('import.i_acknowledge_passphrase_implications')}
            </Label>
          </FlexContainer>
        </BlockContainer>

        <FlexContainer justify={FlexJustifyContent.End}>
          <Button positive disabled={!isCompleted} onClick={onContinue}>
            {i18n.t('import.import_account')}
          </Button>
        </FlexContainer>
      </MaxWidth>
    </AccountBackupPageCard>
  )
}

const DescriptionContainer = styled.div<{hasError?: boolean}>`
  margin-top: ${({hasError}) => !hasError? '-34px': '-14px'};
`
const MaxWidth = styled.div<{ width: number }>`
  margin-left: auto;
  margin-right: auto;
  max-width: ${(props) => props.width + 'px'};
`

const BlockContainer = styled.div`
  margin-bottom: 40px;
`
