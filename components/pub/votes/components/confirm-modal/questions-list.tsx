import React from 'react'
import styled from 'styled-components'

import { colors } from 'theme/colors'
import i18n from '@i18n'
import { SectionText } from '@components/text'
import { Grid, Column } from '@components/grid'
import { Button } from '@components/button'
import { Choice, Question } from '@lib/types'
import { Else, If, Then } from 'react-if'

interface IModalQuestionList {
  questions: Question[]
  choices: number[]
  sendingVote: boolean
  onClose: () => void
  onSubmit: () => void
}

export const ModalQuestionList = ({
  questions,
  choices,
  sendingVote,
  onSubmit,
  onClose,
}: IModalQuestionList) => {
  const renderQuestion = (question: Question, choice: Choice, index) => (
    <div key={index}>
      <QuestionGroup>
        <SectionText color="#7E89AC">
          {i18n.t('vote.question', { number: index + 1 })}
        </SectionText>
        <QuestionText>{question?.title.default}</QuestionText>
      </QuestionGroup>

      <QuestionGroup>
        <SectionText color="#7E89AC">{i18n.t('vote.your_choice')}</SectionText>
        <QuestionText>{choice?.title.default}</QuestionText>
      </QuestionGroup>
    </div>
  )
  return (
    <>
      <ModalHeader>{i18n.t('vote.confirm_your_vote')}</ModalHeader>
      <If condition={!sendingVote}>
        <Then>
          {questions.map((question: Question, index: number) =>
            renderQuestion(question, question.choices[choices[index]], index)
          )}
        </Then>
        <Else>
          <SectionText color="#7E89AC">
            {i18n.t('vote.sending_vote_please_dont_close_the_browsers')}
          </SectionText>
        </Else>
      </If>

      <Grid>
          <If condition={!sendingVote}>
            <Column sm={6}>
              <Button
                wide
                color={colors.accent1}
                onClick={onClose}
                disabled={sendingVote}
              >
                {i18n.t('vote.no_back_to_login')}
              </Button>
            </Column>
          </If>

          <Column sm={sendingVote? 12: 6}>
            <Button
              wide
              positive
              onClick={onSubmit}
              disabled={sendingVote}
              spinner={sendingVote}
            >
              {i18n.t('vote.yes_submit_the_vote')}
            </Button>
          </Column>
      </Grid>
    </>
    
  )
}

const ModalHeader = styled(SectionText)`
  font-size: 20px;
  color: ${({ theme }) => theme.accent1};
`

const QuestionText = styled(SectionText)`
  size: 22px;
  font-weight: 500;
`

const QuestionGroup = styled.div`
  margin: 24px 0;
`
