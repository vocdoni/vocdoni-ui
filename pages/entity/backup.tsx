import { useDbAccounts } from '@hooks/use-db-accounts'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import React, { useState } from 'react'
import { PageCard } from '../../components/cards'
import { Input, Select } from '../../components/inputs'
import { Checkbox } from '@aragon/ui'

import { Column, Grid } from '../../components/grid'
import { MainTitle, MainDescription } from '../../components/text'
import i18n from '../../i18n'
import { hasDuplicates } from '../../lib/util'
import styled from 'styled-components'
import { Button } from '@components/button'
import { serializeWalletBackup, WalletBackup_Recovery_QuestionEnum } from 'dvote-js'

const QUESTION_COUNT = 3
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

const AccountBackup = () => {
  const { wallet } = useWallet({ role: WalletRoles.ADMIN })
  const { dbAccounts } = useDbAccounts()
  const [answers, setAnswers] = useState<string[]>([])
  const [questionIndexes, setQuestionIndexes] = useState<number[]>([])
  const [ack, setAck] = useState(false)

  const onContinue = () => {
    alert("TO DO ")

    const buff = serializeWalletBackup({
      name: dbAccounts.find(acc => acc.address == wallet?.address)?.name,
      timestamp: Math.floor(Date.now() / 1000),
      passphraseRecovery: null,
      wallet
    })
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
  const isCompleted = answers.length == QUESTION_COUNT &&
    questionIndexes.length == QUESTION_COUNT &&
    answers.every(v => !!v) &&
    questionIndexes.every(v => v >= 0) &&
    !hasDupes

  return (
    <PageCard>
      <Grid>
        <Column>
          <MainTitle>{i18n.t("backup.download_credentials")}</MainTitle>
          <MainDescription>{i18n.t("backup.protect_your_account_and_export_it_in_a_safe_way")}</MainDescription>
        </Column>
        <Column>

          <MaxWidth width={600}>
            {
              new Array(QUESTION_COUNT).fill(0).map((_, qIdx) => {
                const availableIdxs = allRecoveryQuestions.map(() => true)
                // Mark the indexes for questions already being used
                questionIndexes.forEach((i) => { if (i >= 0) availableIdxs[i] = false })
                const availableQuestions = allRecoveryQuestions.filter((q, idx) => availableIdxs[idx])

                return <>
                  <Select onChange={item => onSelectIndex(qIdx, item.value)} options={availableQuestions} />
                  <Input wide onChange={e => onSetAnswer(qIdx, e.target.value)} />
                </>
              })
            }

            <label>
              <Checkbox
                checked={ack}
                onChange={(ack: boolean) => setAck(ack)}
              />
              {i18n.t("backup.i_acknowledge_passphrase_implications")}
            </label>

            <br />
            <br />

            <BottomDiv>
              <div />
              <Button positive disabled={!isCompleted} onClick={onContinue}>{i18n.t("backup.continue")}</Button>
            </BottomDiv>
          </MaxWidth>

        </Column>
      </Grid>
    </PageCard>
  )
}

const MaxWidth = styled.div<{ width: number }>`
margin-left: auto;
margin-right: auto;
max-width: ${props => props.width + "px"};
`

const BottomDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`

export default AccountBackup
