import React, { useState } from 'react'
import styled from 'styled-components'

import { WalletBackup, AccountBackup, Symmetric } from 'dvote-js'
import { Wallet } from '@ethersproject/wallet'
import Spinner from 'react-rainbow-components/components/Spinner'
import { Else, If, Then } from 'react-if'

import i18n from '@i18n'

import { colors } from 'theme/colors'

import { useDbAccounts } from '@hooks/use-db-accounts'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { useMessageAlert } from '@hooks/message-alert'

import { InvalidAnswersError } from '@lib/validators/errors/invalid-answers-error'
import { passphraseValidator } from '@lib/validators/passphrase-validator'
import { PassphraseNoMatchError } from '@lib/validators/errors/passphrase-no-match-error'
import { InvalidPassphraseFormatError } from '@lib/validators/errors/invalid-passphrase-format-error'

import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/flex'
import { FormGroupVariant, InputFormGroup } from '@components/form'
import { Label } from '@components/label'
import { SectionText, TextSize } from '@components/text'
import { Checkbox } from '@components/checkbox'
import { Button } from '@components/button'

import { ALL_RECOVER_QUESTIONS } from '../const/questions-list'
import { AccountBackupPageCard } from '../components/page-card'

interface IQuestionsFormViewProps {
  accountBackup: WalletBackup
  accountBackupBytes: Uint8Array
  onRestoreBackup: () => void
  onSelectOtherBackup: () => void
}

export const QuestionsFormView = ({
  accountBackup,
  accountBackupBytes,
  onRestoreBackup,
  onSelectOtherBackup,
}: IQuestionsFormViewProps) => {
  const [newPassphrase, setNewPassphrase] = useState<string>('')
  const [repeatPassphrase, setRepeatPassphrase] = useState<string>('')

  const [ack, setAck] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [passphraseError, setPassphraseError] = useState<string>()
  const [questionsError, setQuestionsError] = useState<string>()

  const { setAlertMessage } = useMessageAlert()
  const { dbAccounts, addDbAccount, updateAccount } = useDbAccounts()
  const { setWallet } = useWallet({ role: WalletRoles.ADMIN })

  const questionsIds = accountBackup.passphraseRecovery.questionIds

  const onSetAnswer = (qIdx: number, value: string) => {
    const newAnswers = [].concat(answers)
    newAnswers[qIdx] = value
    setAnswers(newAnswers)
  }

  const isCompleted = answers.length && newPassphrase && ack

  const handleContinue = async () => {
    setLoading(true)
    setQuestionsError(null)
    setPassphraseError(null)

    try {
      const decryptedPassphrase = AccountBackup.recoverPassphrase(
        accountBackupBytes,
        answers
      )

      if (!decryptedPassphrase) throw new InvalidAnswersError()

      const buffer = Buffer.from(accountBackup.wallet.encryptedMnemonic)
      const originalEncryptedMnemonic = buffer.toString('base64')

      // Recover the wallet
      const mnemonic = Symmetric.decryptString(
        originalEncryptedMnemonic,
        decryptedPassphrase
      )

      const passphraseError = passphraseValidator(
        newPassphrase,
        repeatPassphrase
      )

      if (passphraseError) {
        throw passphraseError
      }

      const wallet = Wallet.fromMnemonic(mnemonic, accountBackup.wallet.hdPath)

      // Protect with the new passphrase
      const encryptedMnemonic = Symmetric.encryptString(
        wallet.mnemonic.phrase,
        newPassphrase
      )

      const account = dbAccounts.find((acc) => acc.address == wallet.address)
      if (account) {
        // Update account if  exists
        await updateAccount({
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
          hasBackup: true,
        })
      }

      setWallet(wallet)

      onRestoreBackup()
    } catch (err) {
      if (
        err instanceof InvalidPassphraseFormatError ||
        err instanceof PassphraseNoMatchError
      ) {
        setPassphraseError(err.message)
      } else if (err instanceof InvalidAnswersError) {
        setQuestionsError(i18n.t('recover.invalid_recover_questions'))
      } else {
        setAlertMessage(i18n.t("errors.the_recovery_could_not_be_completed"))
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <AccountBackupPageCard
      title={i18n.t('recover.reset_your_passphrase')}
      subtitle={i18n.t('recover.drag_a_vocdoni_backup_file')}
    >
      <MaxWidth width={600}>
        <BlockContainer>
          {questionsIds.map((question, qIdx) => {
            return (
              <InputFormGroup
                error={questionsError}
                label={
                  ALL_RECOVER_QUESTIONS.find((x) => x.value == question).label
                }
                variant={FormGroupVariant.Small}
                value={answers[qIdx]}
                onChange={(e) => onSetAnswer(qIdx, e.target.value)}
              />
            )
          })}
        </BlockContainer>
        <BlockContainer>
          <SectionText size={TextSize.Big} color={colors.blueText}>
            {i18n.t('recover.new_passphrase')}
          </SectionText>
          <InputFormGroup
            label={i18n.t('recover.enter_a_new_passphrase')}
            value={newPassphrase}
            error={passphraseError}
            variant={FormGroupVariant.Small}
            type="password"
            onChange={(e) => setNewPassphrase(e.target.value)}
          />

          <InputFormGroup
            label={i18n.t('recover.repeat_a_new_passphrase')}
            value={repeatPassphrase}
            error={passphraseError}
            variant={FormGroupVariant.Small}
            type="password"
            onChange={(e) => setRepeatPassphrase(e.target.value)}
          />
        </BlockContainer>

        <BlockContainer>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            <Checkbox
              id="terms-and-conditions"
              checked={ack}
              onChange={(ack: boolean) => setAck(ack)}
              text={i18n.t('recover.i_acknowledge_passphrase_implications')}
              labelColor={colors.lightText}
            />
          </FlexContainer>
        </BlockContainer>

        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <If condition={loading}>
            <Then>
              <Spinner />
            </Then>

            <Else>
              <Button negative onClick={onSelectOtherBackup}>
                {i18n.t('recover.select_other_file')}
              </Button>
              <Button positive disabled={!isCompleted} onClick={handleContinue}>
                {i18n.t('recover.reset_passphrase')}
              </Button>
            </Else>
          </If>
        </FlexContainer>
      </MaxWidth>
    </AccountBackupPageCard>
  )
}

const BlockContainer = styled.div`
  margin-bottom: 20px;
`

const MaxWidth = styled.div<{ width: number }>`
  margin-left: auto;
  margin-right: auto;
  max-width: ${(props) => props.width + 'px'};
`
