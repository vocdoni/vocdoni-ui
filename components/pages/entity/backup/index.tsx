import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

import {
  AccountBackup,
  WalletBackup_Recovery_QuestionEnum,
  Wallet_AuthMethod,
} from 'dvote-js'

import i18n from '@i18n'

import { useMessageAlert } from '@hooks/message-alert'

import { colors } from 'theme/colors'

import { downloadFile, hasDuplicates } from '@lib/util'
import { Account } from '@lib/types'

import { Input, Select } from '@components/elements/inputs'
import { Column, Grid } from '@components/elements/grid'
import { SectionText } from '@components/elements/text'
import { Button } from '@components/elements/button'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/elements/flex'
import { InputFormGroup } from '@components/blocks/form'
import { Checkbox } from '@components/elements/checkbox'
import { Label } from '@components/elements/label'

import { AccountBackupPageCard } from '../components/page-card'
import { ALL_RECOVER_QUESTIONS } from '../const/questions-list'

const QUESTION_COUNT = 3

interface AccountBackupViewProps {
  account: Account
  onBackup: () => void
}

export const AccountBackupView = ({
  account,
  onBackup,
}: AccountBackupViewProps) => {
  const [answers, setAnswers] = useState<string[]>([])
  const [questionIndexes, setQuestionIndexes] = useState<number[]>([])
  const [ack, setAck] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const { setAlertMessage } = useMessageAlert()

  const onContinue = () => {
    const allGood = new Array(QUESTION_COUNT).fill(0).every((_, i) => {
      if (!answers[i]) return false
      else if (
        typeof questionIndexes[i] != 'number' ||
        questionIndexes[i] < 0 ||
        questionIndexes[i] >= ALL_RECOVER_QUESTIONS.length
      )
        return false
      return true
    })

    if (!allGood)
      return setAlertMessage(
        i18n.t('errors.please_select_and_fill_all_recovery_questions')
      )
    else if (!passphrase)
      return setAlertMessage(i18n.t('errors.please_confirm_your_passphrase'))

    try {
      const encryptedMnemonic = new Uint8Array(
        Buffer.from(account.encryptedMnemonic, 'base64')
      )
      const backupBytes = AccountBackup.create({
        backupName: account.name,
        questionIds: questionIndexes,
        answers,
        accountWallet: {
          encryptedMnemonic,
          authMethod: Wallet_AuthMethod.PASS,
          hdPath: account.hdPath,
          locale: account.locale,
        },
        currentPassphrase: passphrase,
      })

      downloadFile(backupBytes, { fileName: 'backup_vocdoni_' + account.name + '.bak' })

      onBackup()
    } catch (err) {
      console.log(err)
      setAlertMessage(
        i18n.t(
          'errors.the_backup_cannot_be_generated_please_check_your_passphrase'
        )
      )
    }
  }

  const onSelectIndex = (qIdx: number, idx: number) => {
    if (qIdx >= QUESTION_COUNT) return
    const newIndexes = [].concat(questionIndexes)
    newIndexes[qIdx] = idx
    setQuestionIndexes(newIndexes)
  }
  const onSetAnswer = (qIdx: number, value: string) => {
    if (qIdx >= QUESTION_COUNT) return
    const newAnswers = [].concat(answers)
    newAnswers[qIdx] = value
    setAnswers(newAnswers)
  }

  const hasDupes = hasDuplicates(questionIndexes)
  const isCompleted =
    answers.length == QUESTION_COUNT &&
    questionIndexes.length == QUESTION_COUNT &&
    answers.every((v) => !!v) &&
    questionIndexes.every((v) => v >= 0) &&
    !hasDupes &&
    ack

  return (
    <AccountBackupPageCard
      title={i18n.t('backup.download_credentials')}
      subtitle={i18n.t(
        'backup.protect_your_account_and_export_it_in_a_safe_way'
      )}
    >
      <Grid>
        <Column>
          <MaxWidth width={600}>
            {new Array(QUESTION_COUNT).fill(0).map((_, qIdx) => {
              const availableIdxs = ALL_RECOVER_QUESTIONS.map(() => true)
              // Mark the indexes for questions already being used
              questionIndexes.forEach((i) => {
                if (i >= 0) availableIdxs[i] = false
              })
              const availableQuestions = ALL_RECOVER_QUESTIONS.filter(
                (q, idx) => availableIdxs[idx]
              )

              return (
                <QuestionContainer key={qIdx}>
                  <SectionText color={colors.blueText}>
                    {i18n.t('backup.recovery_question', { number: qIdx + 1 })}
                  </SectionText>
                  <Select
                    onChange={(item) => onSelectIndex(qIdx, item.value)}
                    options={availableQuestions}
                  />
                  <Input
                    wide
                    onChange={(e) => onSetAnswer(qIdx, e.target.value)}
                  />
                </QuestionContainer>
              )
            })}

            <InputFormGroup
              type="password"
              label={i18n.t('backup.confirm_your_passphrase')}
              value={passphrase}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassphrase(e.target.value)}
            />

            <QuestionContainer>
              <FlexContainer alignItem={FlexAlignItem.Center}>
                <Checkbox
                  checked={ack}
                  id="terms-check"
                  onChange={(ack: boolean) => setAck(ack)}
                  text={i18n.t('backup.i_acknowledge_passphrase_implications')}
                  labelColor={colors.lightText}
                />
              </FlexContainer>
            </QuestionContainer>

            <FlexContainer justify={FlexJustifyContent.End}>
              <Button positive disabled={!isCompleted} onClick={onContinue}>
                {i18n.t('backup.continue')}
              </Button>
            </FlexContainer>
          </MaxWidth>
        </Column>
      </Grid>
    </AccountBackupPageCard>
  )
}

const MaxWidth = styled.div<{ width: number }>`
  margin-left: auto;
  margin-right: auto;
  max-width: ${(props) => props.width + 'px'};
`

const QuestionContainer = styled.div`
  margin-bottom: 20px;
`
