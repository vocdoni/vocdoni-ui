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

import { BackupFileSelector } from '@components/entity/components/backup-file-selector'

import { AccountBackup, WalletBackup, Symmetric, WalletBackup_Recovery_QuestionEnum, } from 'dvote-js'

import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useRouter } from 'next/router'
import { useMessageAlert } from '../../hooks/message-alert'

const allRecoveryQuestions = [
  {
    label: i18n.t("backup.STUFFED_TOY"),
    value: WalletBackup_Recovery_QuestionEnum.STUFFED_TOY
  }, {
    label: i18n.t("backup.FAVORITE_TEACHER"),
    value: WalletBackup_Recovery_QuestionEnum.FAVORITE_TEACHER
  }, {
    label: i18n.t("backup.DRIVING_INSTRUCTOR"),
    value: WalletBackup_Recovery_QuestionEnum.DRIVING_INSTRUCTOR
  }, {
    label: i18n.t("backup.FIRST_KISSED"),
    value: WalletBackup_Recovery_QuestionEnum.FIRST_KISSED
  }, {
    label: i18n.t("backup.CHILDHOOD_NICKNAME"),
    value: WalletBackup_Recovery_QuestionEnum.CHILDHOOD_NICKNAME
  }
]

const RecoveryPage = () => {
  const { dbAccounts, addDbAccount, updateAccount } = useDbAccounts()
  const { restoreEncryptedWallet } = useWallet({ role: WalletRoles.ADMIN })
  const router = useRouter()
  const { setAlertMessage } = useMessageAlert()

  const [oldBackup, setOldBackup] = useState<Uint8Array>(null)
  const [oldBackupParsed, setOldBackupParsed] = useState<WalletBackup>(null)
  const [newPassphrase, setNewPassphrase] = useState<string>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [questionIds, setQuestionIds] = useState<number[]>([])
  const [ack, setAck] = useState(false)



  const isCompleted = oldBackup && questionIds.length && answers.length && newPassphrase && ack

  const handleOnBackupUpload = (uploadedBackup: Uint8Array) => {
    setOldBackup(uploadedBackup)
    const parsedBackup = AccountBackup.parse(uploadedBackup)
    setOldBackupParsed(parsedBackup)
    setQuestionIds(parsedBackup.passphraseRecovery.questionIds)

  }

  const onSetAnswer = (qIdx: number, value: string) => {
    const newAnswers = [].concat(answers)
    newAnswers[qIdx] = value
    setAnswers(newAnswers)
  }


  //TODO  Optional: Offer the option to download the backup in this page???
  // const [newBackup, setNewBackup] = useState<Uint8Array>(null)
  // const onBackupDownload = () => {
  //   try {
  //     const backupBytes = AccountBackup.create({
  //       backupName: oldBackupParsed.name,
  //       questionIds: oldBackupParsed.passphraseRecovery.questionIds,
  //       answers,
  //       accountWallet: {
  //         encryptedMnemonic: new Uint8Array(Buffer.from(encryptedMnemonic, "base64")),
  //         authMethod: oldBackupParsed.wallet.authMethod,
  //         hdPath: oldBackupParsed.wallet.hdPath,
  //         locale: oldBackupParsed.wallet.locale
  //       },
  //       currentPassphrase: newPassphrase
  //     })
  //     setNewBackup(backupBytes)
  //     downloadFile(backupBytes, { fileName: oldBackupParsed.name + "-vocdoni.bak" })
  //   } catch (error) {

  //   }
  // }

  const onContinue = () => {

    try {
      const decryptedPassphrase = AccountBackup.recoverPassphrase(oldBackup, answers)

      const buffer = Buffer.from(oldBackupParsed.wallet.encryptedMnemonic)
      const oldEncryptedMnemonic = buffer.toString('base64')
      const wallet = restoreEncryptedWallet(oldEncryptedMnemonic, oldBackupParsed.wallet.hdPath, decryptedPassphrase)

      const encryptedMnemonic = Symmetric.encryptString(wallet.mnemonic.phrase, newPassphrase)

      const account = dbAccounts.find(acc => acc.address == wallet.address)
      console.log('old encrypted mnemonic', account.encryptedMnemonic)
      console.log('new encrypted mnemonic', encryptedMnemonic)
      if (account) {
        // Update account if  exists
        updateAccount(wallet.address, {
          ...account,
          hasBackup: false,
          encryptedMnemonic,
        })
      } else {
        // add account if not exists
        addDbAccount({
          name: oldBackupParsed.name,
          address: wallet.address,
          encryptedMnemonic,
          hdPath: wallet.mnemonic.path,
          locale: oldBackupParsed.wallet.locale,
          hasBackup: false
        })
      }

      // Load dashboard
      router.replace(DASHBOARD_PATH)

    } catch (err) {
      console.error(err)
      setAlertMessage(i18n.t("errors.the_recovery_could not be completed"))
    }

  }


  return (
    <PageCard>
      <Grid>
        <Column>
          <SectionTitle>{i18n.t('recover.reset_your_passphrase')}</SectionTitle>
          <SectionText color={colors.lightText}>
            {i18n.t('recover.drag_a_vocdoni_backup_file')}
          </SectionText>
        </Column>

        <MaxWidth width={600}>
          <FileContainer>
            // TODO Implement view when the file is uploaded
          {oldBackup ? (
              <></>
            ) : (
              <BackupFileSelector onBackupLoad={handleOnBackupUpload} />
            )}
          </FileContainer>

          <SectionText size={TextSize.Small}>
            {i18n.t(
              'recover.credentials_explanation'
            )}
          </SectionText>

          {oldBackup && questionIds ?
            questionIds.map((question, qIdx) => {
              // Mark the indexes for questions already being used

              return <>
                <p> {allRecoveryQuestions.find(x => x.value == question).label} </p>
                <Input wide onChange={e => onSetAnswer(qIdx, e.target.value)} />
              </>
            })
            :
            <></>
          }

          <p>{i18n.t("recover.enter_a_new_passphrase")}</p>
          <Input wide type="password" onChange={e => setNewPassphrase(e.target.value)} />

          <label>
            <Checkbox
              checked={ack}
              onChange={(ack: boolean) => setAck(ack)}
            />
            {i18n.t("recover.i_acknowledge_passphrase_implications")}
          </label>

          <br />
          <br />
          { }
          // TODO Warn that old backfile would be invalid for the new passaphrase and maybe ask to download new backup file?
          <BottomDiv>
            <Button positive disabled={!isCompleted} onClick={onContinue}>
              {i18n.t('recover.reset_passphrase')
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

export default RecoveryPage
