import { CardDiv } from '@components/elements/cards'
import { Radio } from '@components/elements/radio'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { Choice, Question } from '@lib/types'
import styled from 'styled-components'

interface IQuestionProps {
  question: Question
  questionIndex: number
  onSelectChoice: (choiceIndex: number) => void
  selectedIndex: number
}

export const QuestionCard = ({
  question,
  questionIndex,
  onSelectChoice,
  selectedIndex,
}: IQuestionProps) => {
  return (
    <QuestionCardContainer border>
      <Typography variant={TypographyVariant.H4} margin="0">
        {question.title.default}
      </Typography>
      {question.description && (
        <Typography variant={TypographyVariant.Small}>
          {question.description.default}
        </Typography>
      )}

      <OptionsContainer>
        {question.choices.map((option: Choice, index) => (
          <Radio
            name={`question-${questionIndex}`}
            key={index}
            // value={option.value.toString()}
            checked={option.value === selectedIndex}
            onClick={() => onSelectChoice(option.value)}
          >
            {option.title.default}
          </Radio>
        ))}
      </OptionsContainer>
    </QuestionCardContainer>
  )
}

const QuestionCardContainer = styled(CardDiv)`
  padding: 64px;

  label {
    font-size: 18px;
    line-height: 22px;
  }

  @media ${({ theme }) => theme.screenMax.tabletL} {
    padding: 32px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 16x;
  }
`

const OptionsContainer = styled.div``
