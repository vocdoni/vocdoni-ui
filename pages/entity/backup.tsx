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
import { When } from 'react-if'

const QUESTION_COUNT = 3
const allRecoveryQuestions = [
  {
    label: 'Question 1',
    value: 0
  }, {
    label: 'Question 2',
    value: 1
  }, {
    label: 'Question 3',
    value: 2
  }
]

const AccountBackup = () => {
  const { wallet } = useWallet({ role: WalletRoles.ADMIN })
  const { dbAccounts } = useDbAccounts()
  const [answers, setAnswers] = useState<string[]>([])
  const [answerIndexes, setAnswerIndexes] = useState<number[]>([])
  const [ack, setAck] = useState(false)

  const onContinue = () => {
    alert("TO DO ")
  }

  const onSelectIndex = (qIdx: number, idx: number) => {
    if (qIdx >= QUESTION_COUNT) return
    const newIndexes = [].concat(answerIndexes)
    newIndexes[qIdx] = idx
    setAnswerIndexes(newIndexes)
  }
  const onSetAnswer = (qIdx: number, value: string) => {
    if (qIdx >= QUESTION_COUNT) return
    const newAnswers = [].concat(answers)
    newAnswers[qIdx] = value
    setAnswers(newAnswers)
  }

  const hasDupes = hasDuplicates(answerIndexes)
  const isCompleted = answers.length == QUESTION_COUNT &&
    answerIndexes.length == QUESTION_COUNT &&
    answers.every(v => !!v) &&
    answerIndexes.every(v => v >= 0) &&
    !hasDupes

  const availableQuestionChoices = [], usedIdxs = []
  for (let i = 0; i < QUESTION_COUNT; i++) {
    // TODO: Remove available indexes for each question as soon as they are used
  }

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
              new Array(QUESTION_COUNT).fill(0).map((_, idx) => <>
                <Select onChange={item => onSelectIndex(idx, item.value)} options={allRecoveryQuestions} />
                <Input wide onChange={e => onSetAnswer(idx, e.target.value)} />
              </>)
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
