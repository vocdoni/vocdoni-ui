import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { colors } from 'theme/colors'
import { SectionText } from '@components/elements/text'
import { Grid, Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { Choice, Question } from '@lib/types'

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
  const { i18n } = useTranslation()
  const renderQuestion = (question: Question, choice: Choice, index) => (
    <div key={index}>
      <QuestionGroup>
        <BoldSectionText color="#7E89AC">
          {i18n.t('vote.question', { number: index + 1 })}
        </BoldSectionText>
        <QuestionText>{question?.title.default}</QuestionText>
      </QuestionGroup>

      <div>
        <BoldSectionText color="#7E89AC">{i18n.t('vote.your_choice')}</BoldSectionText>
        <QuestionText>{choice?.title.default}</QuestionText>
      </div>
    </div>
  )
  return (
    <ModalContent>
      <ModalHeader>{i18n.t('vote.confirm_your_vote')}</ModalHeader>

      <QuestionsContainer>
        {questions.map((question: Question, index: number) =>
          renderQuestion(question, question.choices[choices[index]], index)
        )}
      </QuestionsContainer>

      <Grid>
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

        <Column sm={6}>
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
    </ModalContent>
  )
}

const ModalContent = styled.div`
  position: relative;
`

const QuestionsContainer = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 300px;

  @media ${({theme}) => theme.screenMax.mobileL} {
    max-height: 260px;
  }
`

const ModalHeader = styled(SectionText)`
  font-size: 20px;
  color: ${({ theme }) => theme.accent1};
`

const QuestionText = styled(SectionText)`
  size: 22px;
  font-weight: 500;
  margin-bottom: 4px;
`

const BoldSectionText = styled(SectionText)`
  font-weight: 700;
`

const QuestionGroup = styled.div`
  margin: 24px 0;
`
