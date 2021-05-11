import React, { useState } from 'react'
import styled from 'styled-components'
import { Column, Grid } from '@components/grid'
import { Button } from '@components/button'
import { SectionTitle, SectionText, TextSize } from '@components/text'
import { colors } from 'theme/colors'
import { ACCOUNT_RECOVER, DASHBOARD_PATH } from '@const/routes'
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
import { Else, If, Then, Unless, When } from 'react-if'
import { Wallet } from 'ethers'
import Spinner from "react-svg-spinner"

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
  const { setWallet } = useWallet({ role: WalletRoles.ADMIN })
  const router = useRouter()
  const { setAlertMessage } = useMessageAlert()

  const [loading, setLoading] = useState(false)
  const [accountBackupBytes, setAccountBackupBytes] = useState<Uint8Array>(null)
  const [accountBackup, setAccountBackup] = useState<WalletBackup>(null)
  const [newPassphrase, setNewPassphrase] = useState<string>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [questionIds, setQuestionIds] = useState<number[]>([])
  const [ack, setAck] = useState(false)

  const isCompleted = accountBackup && questionIds.length && answers.length && newPassphrase && ack

  const handleOnBackupUpload = (uploadedBackup: Uint8Array) => {
    setAccountBackupBytes(uploadedBackup)

    const parsedBackup = AccountBackup.parse(uploadedBackup)
    setAccountBackup(parsedBackup)
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
  //       backupName: accountBackup.name,
  //       questionIds: accountBackup.passphraseRecovery.questionIds,
  //       answers,
  //       accountWallet: {
  //         encryptedMnemonic: new Uint8Array(Buffer.from(encryptedMnemonic, "base64")),
  //         authMethod: accountBackup.wallet.authMethod,
  //         hdPath: accountBackup.wallet.hdPath,
  //         locale: accountBackup.wallet.locale
  //       },
  //       currentPassphrase: newPassphrase
  //     })
  //     setNewBackup(backupBytes)
  //     downloadFile(backupBytes, { fileName: accountBackup.name + "-vocdoni.bak" })
  //   } catch (error) {
  //
  //   }
  // }

  const onContinue = async () => {
    try {
      setLoading(true)

      const decryptedPassphrase = AccountBackup.recoverPassphrase(accountBackupBytes, answers)
      if (!decryptedPassphrase) throw new Error("Invalid answers")

      const buffer = Buffer.from(accountBackup.wallet.encryptedMnemonic)
      const originalEncryptedMnemonic = buffer.toString('base64')

      // Recover the wallet
      const mnemonic = Symmetric.decryptString(originalEncryptedMnemonic, decryptedPassphrase)
      const wallet = Wallet.fromMnemonic(mnemonic, accountBackup.wallet.hdPath)

      // Protect with the new passphrase
      const encryptedMnemonic = Symmetric.encryptString(wallet.mnemonic.phrase, newPassphrase)

      const account = dbAccounts.find(acc => acc.address == wallet.address)
      if (account) {
        // Update account if  exists
        await updateAccount(wallet.address, {
          ...account,
          hasBackup: true,
          encryptedMnemonic,
        })
      } else {
        // add account if not exists
        await addDbAccount({
          name: accountBackup.name,
          address: wallet.address,
          encryptedMnemonic,
          hdPath: wallet.mnemonic.path,
          locale: accountBackup.wallet.locale,
          hasBackup: true
        })
      }

      setWallet(wallet)

      // Load dashboard
      setTimeout(() => router.replace(DASHBOARD_PATH), 100)

      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.error(err)
      setAlertMessage(i18n.t("errors.the_recovery_could_not_be_completed"))
    }
  }

  return (
    <PageCard>
      <Grid>
        <Column>
          <SectionTitle>{i18n.t('recover.reset_your_passphrase')}</SectionTitle>
          <SectionText color={colors.lightText}>
            {i18n.t('recover.select_the_backup_file_of_your_account')}
          </SectionText>
        </Column>

        <MaxWidth width={600}>
          <FileContainer>
            <Unless condition={!!accountBackup}>
              <BackupFileSelector onBackupLoad={handleOnBackupUpload} />
            </Unless>
          </FileContainer>

          <SectionText size={TextSize.Small}>
            {i18n.t(
              'recover.credentials_explanation'
            )}
          </SectionText>

          <When condition={!!(accountBackup && questionIds)}>
            {questionIds.map((question, qIdx) => {
              return <>
                <p> {allRecoveryQuestions.find(x => x.value == question)?.label || ("# " + (qIdx + 1))} </p>
                <Input wide onChange={e => onSetAnswer(qIdx, e.target.value)} />
              </>
            })}
          </When>

          <p>{i18n.t("recover.enter_a_new_passphrase")}</p>
          <Input wide type="password" onChange={e => setNewPassphrase(e.target.value)} />

          <label>
            <Checkbox
              checked={ack}
              onChange={(ack: boolean) => setAck(ack)}
            />
            {i18n.t("recover.i_acknowledge_passphrase_implications")}
          </label>

          <br /><br /><br />

          {/* // TODO Warn that old backfile would be invalid for the new passaphrase and maybe ask to download new backup file? */}

          <BottomDiv>
            <If condition={loading}>
              <Then>
                <Spinner />
              </Then>
              <Else>
                <Button positive disabled={!isCompleted} onClick={onContinue}>
                  {i18n.t('recover.reset_passphrase')
                  }</Button>
              </Else>
            </If>
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
  justify-content: center;
`

export default RecoveryPage
