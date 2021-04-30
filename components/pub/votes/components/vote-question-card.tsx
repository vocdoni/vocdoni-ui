import React from 'react'
import i18n from '@i18n'
import styled from 'styled-components'
import { CircularProgressbar } from 'react-circular-progressbar'

import { Card } from '@components/cards'
import { SectionText, SectionTitle } from '@components/text'
import { Column, Grid } from '@components/grid'
import { Radio } from '@components/radio'
import { Choice, Question } from '@lib/types'
import { colors } from 'theme/colors'
import {
  FlexContainer,
  FlexDirection,
  FlexJustifyContent,
} from '@components/flex'
import { DigestedProcessResultItem } from 'dvote-js'

interface IVoteQuestionCardProps {
  question: Question
  index: number
  hasVoted: boolean
  totalVotes: number
  result: DigestedProcessResultItem
  selectedChoice: number
  onSelectChoice: (choiceValue: number) => void
}

export const VoteQuestionCard = ({
  question,
  index,
  hasVoted,
  totalVotes,
  result,
  selectedChoice,
  onSelectChoice,
}: IVoteQuestionCardProps) => {

  const getOptionResult = (index : number) : number =>  (result.voteResults[index].votes).toNumber()

  const getOptionPercentage = (index : number) : number => getOptionResult(index) / totalVotes*100

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
                <OptionContainer key={index}>
                  {hasVoted ? ( // TODO above ProgressBarContainer check if totalVotes exist and if not do not render container
                    <FlexContainer>
                      <ProgressBarContainer>
                        <CircularProgressbar
                          styles={buildGraphStyle(getOptionPercentage(index))}
                          value={getOptionPercentage(index)}
                          text={`${getOptionPercentage(index)}%`}
                        />
                      </ProgressBarContainer>
                      <div>
                        <DescriptionContainer>
                          {choice.title.default}
                        </DescriptionContainer>
                        <SectionText color={colors.lightText}>
                          {i18n.t('vote.number_votes', {'number':getOptionResult(index)})}
                        </SectionText>
                      </div>
                    </FlexContainer>
                  ) : (
                    <Radio
                      onClick={() => onSelectChoice(choice.value)}
                      checked={choice.value === selectedChoice}
                      name={choice.title.default}
                    >
                      {choice.title.default}
                    </Radio>
                  )}
                </OptionContainer>
              ))}
            </FlexContainer>
          </Column>
        </Grid>
      </QuestionContainer>
    </Card>
  )
}
const buildGraphStyle = (percent: number) => {
  const mainColor = percent < 50 ? '#FC8B23' : colors.accent1
  return {
    text: {
      fill: mainColor,
      fontSize: '26px'
    },
    path: {
      stroke: mainColor,
    },
  }
}

const ProgressBarContainer = styled.div`
  width: 60px;
  margin-right: 12px;
`

const DescriptionContainer = styled(SectionText)`
  font-size: 24px;
`

const OptionContainer = styled.div`
  margin: 10px 0;
`

const QuestionContainer = styled.div`
  padding: 12px 20px;
`

const QuestionTitle = styled(SectionTitle)`
  font-size: 33px;
  margin-bottom: 10px;
`
