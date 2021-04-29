import React from 'react'
import i18n from '@i18n'

import { Card } from '@components/cards'
import { SectionText, SectionTitle } from '@components/text'
import { Column, Grid } from '@components/grid'
import { Radio } from '@components/radio'
import { Choice, Question } from '@lib/types'
import styled from 'styled-components'
import { colors } from 'theme/colors'
import {
  FlexContainer,
  FlexDirection,
  FlexJustifyContent,
} from '@components/flex'

interface IVoteQuestionCardProps {
  question: Question
  index: number
  selectedChoice: number
  onSelectChoice: (choiceValue: number) => void
}
export const VoteQuestionCard = ({
  question,
  index,
  selectedChoice,
  onSelectChoice,
}: IVoteQuestionCardProps) => {
  return (
    <Card>
      <QuestionContainer>
        <Grid>
          <Column md={8} sm={12}>
            <SectionText>
              {i18n.t('vote.question', { number: index + 1 })}
            </SectionText>

            <QuestionTitle>{question.title.default}</QuestionTitle>

            <SectionText color={colors.lightText}>
              {question.description.default}
            </SectionText>
          </Column>

          <Column md={4} sm={12}>
            <FlexContainer
              height="100%"
              direction={FlexDirection.Column}
              justify={FlexJustifyContent.Center}
            >
              {question.choices.map((choice: Choice, index) => (
                <RadioContainer key={index}>
                  <Radio
                    onClick={() => onSelectChoice(choice.value)}
                    checked={choice.value === selectedChoice}
                    name={choice.title.default}
                  >
                    {choice.title.default}
                  </Radio>
                </RadioContainer>
              ))}
            </FlexContainer>
          </Column>
        </Grid>
      </QuestionContainer>
    </Card>
  )
}


const RadioContainer = styled.div`
  margin: 16px 0;
`

const QuestionContainer = styled.div`
  padding: 10px 20px;
`

const QuestionTitle = styled(SectionTitle)`
  font-size: 33px;
  margin-bottom: 10px;
`
