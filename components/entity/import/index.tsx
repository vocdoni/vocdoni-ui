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
import { InputFormGroup } from '@components/form'
import { Wallet } from 'ethers'
import { useRouter } from 'next/router'
import { ACCOUNT_RECOVER, DASHBOARD_PATH } from '@const/routes'
import Link from 'next/link'
import { InvalidPassphraseError } from '@lib/validators/errors/invalid-passphrase-error'

interface IAccountImportViewProps {
  onImportedAccount: () => void
}

export const AccountImportView = ({
  onImportedAccount,
}: IAccountImportViewProps) => {
  const [accountBackup, setAccountBackup] = useState<WalletBackup>(null)
  const [passphrase, setPassphrase] = useState<string>(null)
  const [ack, setAck] = useState(false)
  const [invalidPassphrase, setInvalidPassphrase] = useState<string>()
  const { setWallet } = useWallet()
  const { dbAccounts, addDbAccount } = useDbAccounts()
  const { setAlertMessage } = useMessageAlert()
  const router = useRouter()

  const isCompleted = passphrase && accountBackup && ack

  const handleOnBackupUpload = (uploadedBackup: Uint8Array) => {
    setAccountBackup(AccountBackup.parse(uploadedBackup))
  }

  const onContinue = () => {
    const buffer = Buffer.from(accountBackup.wallet.encryptedMnemonic)
    const encryptedMnemonic = buffer.toString('base64')

    try {
      Symmetric.decryptString(encryptedMnemonic, passphrase)
    }
    catch (_) {
      return setInvalidPassphrase(i18n.t('error.invalid_passphrase_error'))
    }

    try {
      // Recover the wallet
      const mnemonic = Symmetric.decryptString(encryptedMnemonic, passphrase)
      const wallet = Wallet.fromMnemonic(mnemonic, accountBackup.wallet.hdPath)

      // Prevent overwriting if already available
      if (dbAccounts.some(acc => acc.name == accountBackup.name)) {
        return setAlertMessage(i18n.t("errors.there_is_already_one_account_with_the_same_name"))
      }
      else if (dbAccounts.some(acc => acc.address == wallet.address)) {
        return setAlertMessage(i18n.t("errors.there_is_already_one_account_with_the_same_credentials"))
      }

      addDbAccount({
        name: accountBackup.name,
        address: wallet.address,
        encryptedMnemonic: Symmetric.encryptString(
          wallet.mnemonic.phrase,
          passphrase
        ),
        hdPath: wallet.mnemonic.path,
        locale: wallet.mnemonic.locale,
        hasBackup: true
      })

      setWallet(wallet)

      onImportedAccount()

      setTimeout(() => router.replace(DASHBOARD_PATH), 1000 * 3)
    } catch (error) {
      setAlertMessage(i18n.t("errors.could_not_import_the_account"))
    }
  }

  return (
    <AccountBackupPageCard
      title={i18n.t('import.import_an_account')}
      subtitle={i18n.t('import.select_the_backup_file_of_your_account')}
    >
      <MaxWidth width={600}>
        <SectionText size={TextSize.Big} color={colors.blueText}>
          {i18n.t('import.backup_file')}
        </SectionText>
        <BlockContainer>
          <BackupFileSelector onBackupLoad={handleOnBackupUpload} />

          <SectionText size={TextSize.Small} color={colors.lightText}>
            {i18n.t('import.backup_file_explanation')}
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
            <Link href={ACCOUNT_RECOVER}>
              {i18n.t('sign_in.forgot_your_password_restore_from_a_backup')}
            </Link>
            <br /><br />
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

const DescriptionContainer = styled.div<{ hasError?: boolean }>`
  margin-top: ${({ hasError }) => !hasError ? '-34px' : '-14px'};
`
const MaxWidth = styled.div<{ width: number }>`
  margin-left: auto;
  margin-right: auto;
  max-width: ${(props) => props.width + 'px'};
`

const BlockContainer = styled.div`
  margin-bottom: 40px;
`
