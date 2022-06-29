import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { colors } from 'theme/colors'
import { SectionText } from '@components/elements/text'
import { Grid, Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { Choice, Question } from '@lib/types'
import { Radio } from '@components/elements/radio'

import { Spacer, Input } from '@components/elements-v2'

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
  let validSMS = true
  let leftSMS = 5
  const renderQuestion = (question: Question, choice: Choice, index) => (
    <div key={index}>
      <div>
        <OptionsContainer>
          <Radio
            name={`question-1`}
            key={index}
            checked={true}
            onClick={() => (index)}
          >
            {choice?.title.default}
          </Radio>
        </OptionsContainer>
      </div>
    </div>
  )
  return (
    <ModalContent>
      <CloseButton onClick={onClose}>
        <ColorSpan>x</ColorSpan>
      </CloseButton>

      <ModalHeader>{i18n.t('vote.confirm_your_vote')}</ModalHeader>
      <SectionText>
        {i18n.t('fcb.confirm_your_vote_text')}
      </SectionText>

      <QuestionsContainer>
        {questions.map((question: Question, index: number) =>
          renderQuestion(question, question.choices[choices[index]], index)
        )}
      </QuestionsContainer>

      <Spacer direction='vertical' size='3xl' />

      <div>
        <HeaderText>{i18n.t('fcb.enter_your_sms')}</HeaderText>
        <input type='text' />
      </div>

      <Spacer direction='vertical' size='3xl' />

      <Grid>
        { false && 
          <Column sm={6}>
            <Button
              fcb_border
              color={colors.FCBBlue}
              onClick={onClose}
              disabled={sendingVote}
            >
              {i18n.t('vote.no_back_to_login')}
            </Button>
          </Column>
        }

        { validSMS ? 
          <Column sm={6}>
            <Button
              wide
              fcb
              onClick={onSubmit}
              disabled={sendingVote}
              spinner={sendingVote}
            >
              {i18n.t('vote.yes_submit_the_vote')}
            </Button>
          </Column>

          :

          <Column sm={6}>
            <Button
              wide
              fcb
              onClick={onSubmit}
              disabled={sendingVote}
              spinner={sendingVote}
            >
              {i18n.t('fcb.send_me_SMS')}
            </Button>
            <Spacer direction='vertical' size='md' />
            <div>{i18n.t('fcb.available_SMS',{ numSMS: leftSMS})}</div>
          </Column>
        }
      </Grid>
    </ModalContent>
  )
}

const OptionsContainer = styled.div`
  border: 2px solid #2E377A;
  border-radius: 12px;
  padding: 0px 10px;
  margin-bottom: 20px;
  margin-top: 20px;
`

const ModalContent = styled.div`
  position: relative;
  padding: 20px 15px;
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
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  color: ${({ theme }) => theme.accent1};
  background: -webkit-linear-gradient(103.11deg, #A50044 0.33%, #174183 99.87%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
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

const HeaderText = styled(SectionText)`
  font-weight: 700;
  font-size: 16px;
  color: #52606D;  
`

const CloseButton = styled.div`
  position: absolute;
  top: -10px;
  right: -20px;
  width: 38px;
  height: 38px;
  align-items: center;
  font-size: 18px;
  line-height: 18px;
  cursor: pointer;

  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;

  background: 
    linear-gradient(#fff 0 0) padding-box, /*this is the white background*/
    linear-gradient(to right, #A50044, #174183) border-box;

  border: 2px solid transparent;
  border-radius: 8px;
  display: inline-block;
`

const ColorSpan = styled.span`
  background: -webkit-linear-gradient(103.11deg, #A50044 0.33%, #174183 99.87%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 400;
  margin-top:9px;
  padding-left:1px;
  display:block;
`