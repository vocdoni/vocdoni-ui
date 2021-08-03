

import React, { ChangeEvent } from 'react'

import cloneDeep from 'lodash/cloneDeep'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { Choice, Question } from '@lib/types'
import { QuestionError } from '@lib/validators/errors/invalid-question-error'
import { DirtyFields } from '@lib/validators'

import { FormGroupVariant, InputFormGroup, TextareaFormGroup } from '@components/blocks/form'
import { Button, ButtonColor } from '@components/elements/button'
import { SectionText, TextSize } from '@components/elements/text'
import { Card } from '@components/elements/cards'
import { Grid } from '@components/elements/grid'

import { colors } from 'theme/colors'

interface IQuestionGroupProps {
  question: Question
  index: number
  error: QuestionError
  dirtyFields: DirtyFields
  onDirtyField: (field: string) => void
  onUpdateQuestion: (index, Question) => void
  onDeleteQuestion: (index) => void
  canBeDeleted?: boolean
}

export enum QuestionFields {
  Title = 'title',
  Description = 'description',
}

export const createEmptyOption = (value: number): Choice => ({
  title: {
    default: '',
  },
  value: value,
})

export const QuestionGroup = ({
  question,
  index,
  canBeDeleted,
  error,
  dirtyFields,
  onDirtyField,
  onUpdateQuestion,
  onDeleteQuestion,
}: IQuestionGroupProps) => {
  const { i18n } = useTranslation()
  const handleUpdateQuestion = (field: QuestionFields, value) => {
    const clonedQuestion: Question = cloneDeep(question)
    clonedQuestion[field]['default'] = value

    onUpdateQuestion(index, clonedQuestion)
  }

  const handleBlur = (field: QuestionFields) => {
    onDirtyField(`question-${field}-${index}`)
  }

  const handleChoiceBlur = (choiceIndex: number) => {
    onDirtyField(`question-${index}-choice-${choiceIndex}`)
  }

  const handleUpdateTitleChoice = (choiceIndex: number, value: string) => {
    const clonedQuestion: Question = cloneDeep(question)
    clonedQuestion.choices[choiceIndex][QuestionFields.Title]['default'] = value

    onUpdateQuestion(index, clonedQuestion)
  }

  const handleCreateChoice = () => {
    const clonedQuestion: Question = cloneDeep(question)
    clonedQuestion.choices.push(
      createEmptyOption(clonedQuestion.choices.length)
    )

    onUpdateQuestion(index, clonedQuestion)
  }

  const handleDeleteChoice = (choiceIndex: number) => {
    const clonedQuestion: Question = cloneDeep(question)
    clonedQuestion.choices.splice(choiceIndex, 1)

    for (let choiceIndex in clonedQuestion.choices) {
      clonedQuestion.choices[choiceIndex].value = parseInt(choiceIndex)
    }

    onUpdateQuestion(index, clonedQuestion)
  }

  const getErrorMessage = (field: QuestionFields): string => {
    return dirtyFields.get(`question-${field}-${index}`) && error ? error[field]?.message : null
  }

  const getChoiceErrorMessage = (choiceIndex: number): string => {
    return dirtyFields.get(`question-${index}-choice-${choiceIndex}`) && error
      ? error.choices[choiceIndex]?.message
      : null
  }

  return (
    <Grid>
      <Card sm={12} border>
        <FormContainer>
          <ContentContainer>
            <FillSpaceWrapper>
              <SectionText color={colors.blueText} size={TextSize.Big}>
                {i18n.t('vote.question', { number: index + 1 })}
              </SectionText>
            </FillSpaceWrapper>

            {canBeDeleted && (
              <Button
                border
                width={50}
                onClick={() => {
                  onDeleteQuestion(index)
                }}
              >
                <img
                  src="/images/vote/bin.svg"
                  alt={i18n.t('vote.delete_question')}
                />
              </Button>
            )}
          </ContentContainer>

          <InputFormGroup
            placeholder={i18n.t('vote.title')}
            variant={FormGroupVariant.Small}
            value={question.title.default}
            id={`process-question-${index}-title`}
            error={getErrorMessage(QuestionFields.Title)}
            onBlur={() => handleBlur(QuestionFields.Title)}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleUpdateQuestion(QuestionFields.Title, event.target.value)
            }
          />

          <TextareaFormGroup
            placeholder={i18n.t('vote.description')}
            rows={5}
            variant={FormGroupVariant.Small}
            id={`process-question-${index}-description`}
            value={question.description.default}
            error={getErrorMessage(QuestionFields.Description)}
            onBlur={() => handleBlur(QuestionFields.Description)}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              handleUpdateQuestion(
                QuestionFields.Description,
                event.target.value
              )
            }
          />

          {question.choices.map((choice: Choice, choiceIndex: number) => (
            <ContentContainer key={choiceIndex}>
              <FillSpaceWrapper>
                <InputFormGroup
                  label={i18n.t('vote.option_n', { number: choiceIndex + 1 })}
                  variant={FormGroupVariant.Small}
                  placeholder={i18n.t('vote.set_option')}
                  value={choice.title.default}
                  id={`process-vote-option-${choiceIndex}`}
                  error={getChoiceErrorMessage(choiceIndex)}
                  onBlur={() => handleChoiceBlur(choiceIndex)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    handleUpdateTitleChoice(choiceIndex, event.target.value)
                  }}
                />
              </FillSpaceWrapper>

              <FormButtonWrapper>
                {question.choices.length > 2 && (
                  <Button
                    border
                    large
                    width={50}
                    onClick={() => handleDeleteChoice(choiceIndex)}
                  >
                    <img
                      src="/images/vote/cross.svg"
                      alt={i18n.t('vote.delete_option')}
                    />
                  </Button>
                )}
              </FormButtonWrapper>
            </ContentContainer>
          ))}

          <AddOptionButtonContainer>
            <Button
              onClick={handleCreateChoice}
              border
              color={ButtonColor.Positive}
            >
              {i18n.t('vote.add_option')}
            </Button>
          </AddOptionButtonContainer>
        </FormContainer>
      </Card>
    </Grid>
  )
}

const FormContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 10px auto;
`

const AddOptionButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const ContentContainer = styled.div`
  display: flex;
`
const FillSpaceWrapper = styled.div`
  flex: 1;
  padding-right: 18px;
`

const FormButtonWrapper = styled.div`
  margin-top: 26px;
  width: 52px;
`
