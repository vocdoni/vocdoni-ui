import React from 'react'
import styled, { useTheme } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { SectionText } from '@components/elements/text'
import { Grid, Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { Choice, Question } from '@lib/types'
import { Typography, TypographyVariant } from '@components/elements/typography'

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
  const { accent1 } = useTheme()
  const renderQuestion = (question: Question, choice: Choice, index) => (
    <div key={index}>
      <QuestionGroup>
        <SectionText color="#7E89AC">
          <strong>{i18n.t('vote.question', { number: index + 1 })}</strong>
        </SectionText>
        <QuestionText>{question?.title.default}</QuestionText>
      </QuestionGroup>

      <div>
        <SectionText color="#7E89AC">{i18n.t('vote.your_choice')}</SectionText>
        <QuestionText>{choice?.title.default}</QuestionText>
      </div>
    </div>
  )
  return (
    <ModalContent>
      <ModalHeader>{i18n.t('vote.confirm_your_vote')}</ModalHeader>

      <QuestionsContainer>
        {!sendingVote ? (
          questions.map((question: Question, index: number) =>
            renderQuestion(question, question.choices[choices[index]], index)
          )
        ) : (
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('vote.sending_vote_please_dont_close_the_browsers')}
          </Typography>
        )}
      </QuestionsContainer>

      <Grid>
        {!sendingVote && (
          <Column sm={6}>
            <Button
              wide
              color={accent1}
              onClick={onClose}
              disabled={sendingVote}
            >
              {i18n.t('vote.no_back_to_login')}
            </Button>
          </Column>
        )}

        <Column sm={sendingVote ? 12 : 6}>
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
  -webkit-overflow-scrolling:touch;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    max-height: 260px;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling:touch;
  }

  ::-webkit-scrollbar {
      width: 10px;
  }
   
  ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.4); 
      border-radius: 8px;
      -webkit-border-radius: 8px;
  }
   
  ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 10px;
      border-radius: 10px;
      background: rgba(100,100,100,0.8); 
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
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

const QuestionGroup = styled.div`
  margin: 24px 0;
`
