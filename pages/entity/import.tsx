import React, { useState } from 'react'
import styled from 'styled-components'
import { Column, Grid } from '@components/grid'
import { Button } from '@components/button'
import { SectionTitle, SectionText, TextSize } from '@components/text'
import { colors } from 'theme/colors'
import { DASHBOARD_PATH } from '@const/routes'
import { PageCard } from '@components/cards'
import { Input } from '../../components/inputs'
import { Checkbox } from '@aragon/ui'
import i18n from '../../i18n'

import { BackupFileSelector } from '@components/entity/backup-file-selector'

import { Symmetric, WalletBackup } from 'dvote-js'

import { useWallet } from '@hooks/use-wallet'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useRouter } from 'next/router'
import { useMessageAlert } from '../../hooks/message-alert'


export const AccountImportView = () => {
  const router = useRouter()
  const [backup, setBackup] = useState<WalletBackup>(null)
  const [passphrase, setPassphrase] = useState<string>(null)
  const [ack, setAck] = useState(false)
  const { restoreEncryptedWallet } = useWallet()
  const { dbAccounts, addDbAccount } = useDbAccounts()
  const { setAlertMessage } = useMessageAlert()

  const isCompleted = passphrase && backup && ack

  const handleOnBackupUpload = (backup: WalletBackup) => {
    setBackup(backup)
  }

  const onContinue = () => {
    try {
      // Restore wallet
      const buffer = Buffer.from(backup.wallet.encryptedMnemonic)
      const encryptedMnemonic = buffer.toString('base64')
      const wallet = restoreEncryptedWallet(encryptedMnemonic, backup.wallet.hdPath, passphrase)

      // Add account if not exists
      const account = dbAccounts.find(acc => acc.address == wallet.address)
      if (!account)
        addDbAccount({
          name: backup.name,
          address: wallet.address,
          encryptedMnemonic: Symmetric.encryptString(wallet.mnemonic.phrase, passphrase),
          hdPath: wallet.mnemonic.path,
          locale: backup.wallet.locale,
        })

      // Load dashboard
      router.replace(DASHBOARD_PATH)
    } catch (error) {
      console.error(error)
      setAlertMessage(i18n.t('import.error_importing_account'))
    }
  }

  return (
    <PageCard>
      <Grid>
        <Column>
          <SectionTitle>{i18n.t('import.import_an_account')}</SectionTitle>
          <SectionText color={colors.lightText}>
            {i18n.t('import.drag_a_vocdoni_backup_file')}
          </SectionText>
        </Column>

        <MaxWidth width={600}>
          <FileContainer>
            // TODO Implement view when the file is uploaded
          {backup ? (
              <></>
            ) : (
              <BackupFileSelector onBackupLoad={handleOnBackupUpload} />
            )}
          </FileContainer>

          <SectionText size={TextSize.Small}>
            {i18n.t(
              'import.credentials_explanation'
            )}
          </SectionText>
          <p>{i18n.t("import.confirm_your_passphrase")}</p>
          <Input wide type="password" onChange={e => setPassphrase(e.target.value)} />

          <label>
            <Checkbox
              checked={ack}
              onChange={(ack: boolean) => setAck(ack)}
            />
            {i18n.t("import.i_acknowledge_passphrase_implications")}
          </label>

          <br />
          <br />
          <BottomDiv>
            <Button positive disabled={!isCompleted} onClick={onContinue}>
              {i18n.t('import.import_account')
              }</Button>
          </BottomDiv>
        </MaxWidth>
      </Grid>
    </PageCard>
  )
}

const MaxWidth = styled.div<{ width: number }>`
margin-left: auto;
margin-right: auto;
max-width: ${props => props.width + "px"};
`


const FileContainer = styled.div<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export default AccountImportView
