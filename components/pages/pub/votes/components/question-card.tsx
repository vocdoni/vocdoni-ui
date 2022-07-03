import React from 'react'
import styled from 'styled-components'
import { Column, Grid } from '@components/elements/grid'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { Choice, Question } from '@lib/types'
import { Radio } from '@components/elements/radio'
import { CardDiv } from '@components/elements/cards'
import { useTranslation } from 'react-i18next'

interface IQuestionProps {
  question: Question
  questionIndex: number
  onSelectChoice: (choiceIndex: number) => void
  selectedIndex: number,
  isDisabled?: boolean
}

export const QuestionCard = ({
  question,
  questionIndex,
  onSelectChoice,
  selectedIndex,
  isDisabled
}: IQuestionProps) => {
  const { i18n } = useTranslation()
  
  return (
    <QuestionCardContainer>
      <Typography variant={TypographyVariant.H4} margin="0">
        {question.title.default}
      </Typography>
      
      { isDisabled && 
        <Typography variant={TypographyVariant.Small}>
          {i18n.t('fcb.candidates')}
        </Typography>
      }

      { !isDisabled && 
        <Typography variant={TypographyVariant.Small}>
          {i18n.t('fcb.select_candidates')}
        </Typography>
      }

      <OptionsContainer>
        {question.choices.map((option: Choice, index) => (
          <Radio
            name={`question-${questionIndex}`}
            key={index}
            // value={option.value.toString()}
            checked={option.value === selectedIndex}
            onClick={() => onSelectChoice(option.value)}
            disabled={isDisabled}
          >
            {(option.value === selectedIndex) && 
              <>
                { option.title.default === 'Blanc' && 
                  <SelectedOption>{i18n.t('fcb.blank_option')}</SelectedOption>
                }

                { option.title.default !== 'Blanc' &&
                  <SelectedOption>{ option.title.default }</SelectedOption>
                }
              </>
            }

            {(option.value !== selectedIndex) &&
              <>
                { option.title.default === 'Blanc' && 
                  <>{i18n.t('fcb.blank_option')}</>
                }

                { option.title.default !== 'Blanc' &&
                  <>{ option.title.default }</>
                }
              </>              
            }
          </Radio>
        ))}        
      </OptionsContainer>
    </QuestionCardContainer>
  )
}

const SelectedOption = styled.div`
  background: -webkit-linear-gradient(103.11deg, #A50044 0.33%, #174183 99.87%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 600;
`

const QuestionCardContainer = styled(CardDiv)`
  padding: 20px 0px;
  box-shadow: none;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    padding: 12px 0px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 16x;
  }
`

const OptionsContainer = styled.div``
